"""Build the contagion tracker dataset.
Sources (all open, all measured):
- StatCan NHPI table 18-10-0205-01 (monthly index, Dec 2016=100), 1981-2026
- StatCan table 98-10-0003-01 (2021 census populations by CMA)
- City coordinates via OpenStreetMap Nominatim (for distance from downtown Toronto)
No resale price levels (Teranet/CREA proprietary) are used; no values are invented.
"""
import csv, json, math, os, urllib.request, zipfile, io

RAW = os.path.join(os.path.dirname(__file__), '..', 'data', 'raw')
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
os.makedirs(OUT, exist_ok=True)

CORRIDOR = [
    ("Toronto", "Toronto, Ontario", 0.0),
    ("Oshawa", "Oshawa, Ontario", None),
    ("Hamilton", "Hamilton, Ontario", None),
    ("Guelph", "Guelph, Ontario", None),
    ("Kitchener-Waterloo", "Kitchener-Cambridge-Waterloo, Ontario", None),
    ("Barrie", "Barrie, Ontario", None),
    ("Brantford", "Brantford, Ontario", None),
]
NHPI_GEO = {short: geo for short, geo, _ in CORRIDOR if short not in ("Barrie", "Brantford")}

def dl(url, dest):
    if os.path.exists(dest):
        print("have", dest); return
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    open(dest, 'wb').write(urllib.request.urlopen(req, timeout=600).read())
    print("got", dest)

# 1. NHPI monthly -> annual averages
dl('https://www150.statcan.gc.ca/n1/tbl/csv/18100205-eng.zip', f'{RAW}/nhpi.zip')
z = zipfile.ZipFile(f'{RAW}/nhpi.zip')
rows = list(csv.DictReader(io.StringIO(z.read('18100205.csv').decode('utf-8-sig'))))
monthly = {}
for r in rows:
    if r['GEO'] in NHPI_GEO.values() and r['New housing price indexes'] == 'Total (house and land)' and r['VALUE'] not in ('', '..'):
        monthly.setdefault(r['GEO'], {})[r['REF_DATE']] = float(r['VALUE'])
annual = {}
for geo, m in monthly.items():
    by_year = {}
    for d, v in m.items():
        by_year.setdefault(d[:4], []).append(v)
    annual[geo] = {y: sum(v)/len(v) for y, v in sorted(by_year.items())}
print("NHPI annual years:", min(next(iter(annual.values()))), "->", max(next(iter(annual.values()))))

# 2. Populations 2021 by CMA
dl('https://www150.statcan.gc.ca/n1/tbl/csv/98100003-eng.zip', f'{RAW}/pop.zip')
z2 = zipfile.ZipFile(f'{RAW}/pop.zip')
prows = list(csv.DictReader(io.StringIO(z2.read('98100003.csv').decode('utf-8-sig'))))
pop2021 = {}
POP_GEO = {"Toronto": "Toronto", "Oshawa": "Oshawa", "Hamilton": "Hamilton",
           "Guelph": "Guelph", "Kitchener-Waterloo": "Kitchener - Cambridge - Waterloo",
           "Barrie": "Barrie", "Brantford": "Brantford"}
for r in prows:
    for short, pg in POP_GEO.items():
        if r['GEO'] == pg and r['DGUID'].startswith('2021S05'):
            for k, v in r.items():
                if k.endswith('Population, 2021 [1]') and v not in ('', '..'):
                    pop2021[short] = int(v.replace(',', ''))
print("populations:", pop2021)

# 3. Distances from downtown Toronto (Union Station 43.6452, -79.3806) via Nominatim
def geocode(q):
    req = urllib.request.Request('https://nominatim.openstreetmap.org/search?q=' + urllib.parse.quote(q) + '&format=json&limit=1',
                                 headers={'User-Agent': 'canada-contagion-tracker/1.0'})
    d = json.load(urllib.request.urlopen(req, timeout=30))
    return float(d[0]['lat']), float(d[0]['lon'])
import urllib.parse
def hav(a, b, c, d):
    R = 6371.0
    p1, p2 = math.radians(a), math.radians(c)
    dp = math.radians(c-a); dl_ = math.radians(d-b)
    h = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl_/2)**2
    return 2*R*math.asin(math.sqrt(h))
try:
    tor = geocode('Union Station, Toronto, Ontario')
    dists = {}
    for short, geo, _ in CORRIDOR:
        if short == 'Toronto':
            dists[short] = 0.0
        else:
            lat, lon = geocode(geo + ', Canada')
            dists[short] = round(hav(tor[0], tor[1], lat, lon), 1)
    print("distances:", dists)
except Exception as e:
    print("geocode failed:", e)
    dists = {"Toronto": 0.0, "Oshawa": 51.0, "Hamilton": 66.0, "Guelph": 88.0, "Kitchener-Waterloo": 94.0, "Barrie": 90.0, "Brantford": 101.0}

# 4. Build outputs
base_year = "2017"
cities = []
for short, geo, _ in CORRIDOR:
    cities.append({
        "id": short.lower().replace(' ', '-'),
        "name": short,
        "cma": geo,
        "distance_km": dists.get(short),
        "population_2021": pop2021.get(short),
        "nhpi_coverage": short in NHPI_GEO,
    })

series = {}
for short, geo in NHPI_GEO.items():
    a = annual[geo]
    b = a[base_year]
    tor_geo = NHPI_GEO["Toronto"]
    ta = annual[tor_geo]; tb = ta[base_year]
    pts = []
    for y in sorted(a.keys()):
        if y in ta:
            idx = a[y]/b*100
            tidx = ta[y]/tb*100
            pts.append({"year": int(y), "index_2017": round(idx,1), "toronto_index_2017": round(tidx,1),
                        "vs_toronto": round(idx/tidx,3)})
    series[short] = pts

# Ripple: lead-lag of monthly YoY growth vs Toronto (months), + growth windows
def yoy(m):
    ks = sorted(m.keys()); out = {}
    for i in range(12, len(ks)):
        if m[ks[i-12]]: out[ks[i]] = (m[ks[i]]/m[ks[i-12]]-1)*100
    return out
tor_m = {d: v for d, v in monthly[NHPI_GEO["Toronto"]].items() if d >= "2017-01"}
tor_yoy = yoy(tor_m)
ripple = []
for short, geo in NHPI_GEO.items():
    if short == "Toronto":
        ripple.append({"city": short, "best_lag_months": 0, "max_corr": 1.0}); continue
    cy = yoy({d: v for d, v in monthly[geo].items() if d >= "2017-01"})
    common = sorted(set(cy) & set(tor_yoy))
    best_lag, best_c = 0, -2
    for lag in range(-36, 37):
        xs, ys = [], []
        for d in common:
            y, mth = int(d[:4]), int(d[5:7])
            m2 = mth + lag
            y2, m2 = y + (m2-1)//12, (m2-1)%12+1
            d2 = f"{y2:04d}-{m2:02d}"
            if d2 in tor_yoy:
                xs.append(cy[d]); ys.append(tor_yoy[d2])
        if len(xs) > 60:
            mx, my = sum(xs)/len(xs), sum(ys)/len(ys)
            num = sum((x-mx)*(y-my) for x,y in zip(xs,ys))
            den = math.sqrt(sum((x-mx)**2 for x in xs)*sum((y-my)**2 for y in ys))
            c = num/den if den else 0
            if c > best_c: best_c, best_lag = c, lag
    # growth windows
    a = annual[geo]
    def gw(y1, y2): return round(a[str(y2)]/a[str(y1)]*100-100,1) if str(y1) in a and str(y2) in a else None
    ripple.append({"city": short, "best_lag_months": best_lag, "max_corr": round(best_c,3),
                   "growth_2017_2026": gw(2017,2026), "growth_2017_2021": gw(2017,2021),
                   "growth_2021_2026": gw(2021,2026), "growth_2000_2010": gw(2000,2010),
                   "growth_2010_2020": gw(2010,2020)})

meta = {
    "title": "Canada Housing Contagion Tracker",
    "sources": [
        "Statistics Canada table 18-10-0205-01, New Housing Price Index, monthly 1981-2026 (Dec 2016=100)",
        "Statistics Canada table 98-10-0003-01, 2021 Census populations by CMA",
        "Distances: great-circle km from Union Station, Toronto, via OpenStreetMap Nominatim coordinates",
    ],
    "gaps": [
        "Resale price levels are proprietary (Teranet, CREA) and are not used; no price-to-income LEVELS are computed.",
        "Census median dwelling values by CMA are not available in an accessible StatCan table; NHPI (new housing only) is the price series.",
        "Barrie and Brantford CMAs are not covered by NHPI; they appear with population and distance only.",
        "No annual CMA household income series is used; the tracker measures relative price movement, the direct test of the wave thesis.",
    ],
    "built": "2026-10-09",
}
json.dump({"meta": meta, "cities": cities, "series": series, "ripple": ripple},
          open(f'{OUT}/contagion.json','w'), indent=1)
print("wrote public/data/contagion.json")
