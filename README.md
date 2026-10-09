# The Price Wave

Tests the thesis that Toronto's unaffordability ripples outward. When Toronto prices out a nurse, she moves to Hamilton. Hamilton gets expensive. The wave rolls on to Brantford. This site measures that wave against 45 years of new-housing prices across seven corridor cities.

**Live:** https://pricewave.canada.nshipyard.com

## What the ripple shows

- **Kitchener-Waterloo is the epicentre.** New-home prices rose **46.7%** from 2017 to 2026 against Toronto's **2.9%**, peaking at 154.0 (2017=100) in 2022. By 2026 its index sat at **1.43x** Toronto's.
- **The corridor front-ran the core.** Hamilton's monthly price cycle correlates **0.87** with Toronto's, but its turning points arrive roughly **6 months earlier**. In 2017-2026 the corridor did not follow Toronto with a lag; in the pandemic surge it moved first.
- **The boom was a corridor boom.** 2017-2021: Kitchener-Waterloo +35.4%, Guelph +17.2%, Hamilton +13.5%, Oshawa +13.0%, all ahead of Toronto's +6.6%. The 2021-2026 correction then bit the corridor harder (Hamilton -6.6%).
- **Toronto is flat since 2017.** Index 102.9 in 2026 against 100 in 2017, after peaking at 111.4 in 2022.

## Data

All open, all measured, no invented stats:

| Series | Source | Coverage |
|---|---|---|
| New Housing Price Index (monthly) | StatCan table 18-10-0205-01 | 5 CMAs, Jan 1981 - Aug 2026 |
| 2021 census populations | StatCan table 98-10-0003-01 | 7 CMAs |
| Distances from downtown Toronto | OpenStreetMap Nominatim coordinates, great-circle from Union Station | 7 cities |

**Explicit gaps (stated on the site):** resale price levels are proprietary (Teranet, CREA) and are not used, so no price-to-income levels are computed; census median dwelling values by CMA are not published in an accessible StatCan table; Barrie and Brantford have no NHPI coverage; the NHPI tracks new homes only and its dwelling mix differs by city (Toronto new supply is condo-heavy, the corridor's is detached-heavy).

Rebuild the dataset any time: `python3 scripts/build_data.py` (downloads from StatCan, writes `public/data/contagion.json` and `data/contagion.json`).

## App

Next.js 16, full EN/FR, Open Nshipyard family theme (paper/ink/Canadian red #d80621, Newsreader + Inter).

- `/` : scrubbable ripple chart (2017=100), Toronto-relative catch-up chart, corridor city cards, findings, methodology
- `/api/v1/cities` : seven corridor cities with metadata
- `/api/v1/ripple` : the full dataset
- `/api/openapi.json` : OpenAPI 3.1 spec
- `/mcp` : MCP server over streamable HTTP. Tools: `city_lookup`, `ripple_series`, `contagion_summary`
- `/data/contagion.json`, `/data/nhpi_annual.csv` : downloads, MIT licensed

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Screenshots

![Desktop (EN)](docs/screenshots/desktop-en.png)

![Desktop (FR)](docs/screenshots/desktop-fr.png)

![Mobile (EN)](docs/screenshots/mobile-en.png)

![Mobile (FR)](docs/screenshots/mobile-fr.png)

## Author

**Richardson Dackam** - [X (@richardsondx)](https://x.com/richardsondx) · [GitHub](https://github.com/richardsondx)

## License

MIT. Price data is © Statistics Canada (open data); the ripple analysis is original work.
