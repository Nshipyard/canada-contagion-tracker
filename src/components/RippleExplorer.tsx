"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/i18n";

interface Pt {
  year: number;
  index_2017: number;
  toronto_index_2017: number;
  vs_toronto: number;
}
interface City {
  id: string;
  name: string;
  cma: string;
  distance_km: number | null;
  population_2021: number | null;
  nhpi_coverage: boolean;
}
interface RippleRow {
  city: string;
  best_lag_months: number;
  max_corr: number;
  growth_2017_2026: number | null;
}
interface Bundle {
  cities: City[];
  series: Record<string, Pt[]>;
  ripple: RippleRow[];
}

const COLORS: Record<string, string> = {
  Toronto: "#0a0f1e",
  Hamilton: "#d80621",
  Oshawa: "#b45309",
  Guelph: "#6b7280",
  "Kitchener-Waterloo": "#7f1d1d",
};
const ORDER = ["Toronto", "Oshawa", "Hamilton", "Guelph", "Kitchener-Waterloo"];

function LineChart({
  series,
  year,
  mode,
}: {
  series: Record<string, Pt[]>;
  year: number;
  mode: "index" | "catchup";
}) {
  const W = 760;
  const H = 340;
  const PAD = { l: 52, r: 16, t: 16, b: 36 };
  const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const val = (p: Pt) => (mode === "index" ? p.index_2017 : p.vs_toronto);
  const all = ORDER.flatMap((c) => (series[c] ?? []).map(val));
  const lo = mode === "index" ? Math.floor(Math.min(...all) / 10) * 10 : 0.9;
  const hi = mode === "index" ? Math.ceil(Math.max(...all) / 10) * 10 : Math.ceil(Math.max(...all) * 10) / 10;
  const x = (i: number) => PAD.l + (i / (years.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - lo) / (hi - lo)) * (H - PAD.t - PAD.b);
  const yi = years.indexOf(year);
  const ticks = mode === "index" ? [80, 100, 120, 140, 160] : [0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="price chart">
      {ticks
        .filter((tk) => tk >= lo && tk <= hi)
        .map((tk) => (
          <g key={tk}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(tk)} y2={y(tk)} stroke="rgba(10,15,30,0.08)" />
            <text x={PAD.l - 8} y={y(tk) + 4} textAnchor="end" fontSize="11" fill="rgba(10,15,30,0.55)">
              {mode === "index" ? tk : tk.toFixed(1)}
            </text>
          </g>
        ))}
      {mode === "catchup" && (
        <line x1={PAD.l} x2={W - PAD.r} y1={y(1.0)} y2={y(1.0)} stroke="#0a0f1e" strokeDasharray="5 4" strokeWidth="1.5" />
      )}
      {ORDER.map((c) => {
        const pts = series[c] ?? [];
        if (!pts.length) return null;
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(val(p)).toFixed(1)}`).join(" ");
        const bold = c === "Toronto";
        return (
          <g key={c}>
            <path d={d} fill="none" stroke={COLORS[c]} strokeWidth={bold ? 3 : 2} opacity={bold ? 1 : 0.85} />
            {pts.map((p, i) => (
              <circle
                key={i}
                cx={x(i)}
                cy={y(val(p))}
                r={i === yi ? 5 : 0}
                fill={COLORS[c]}
                stroke="#fff"
                strokeWidth="1.5"
              />
            ))}
          </g>
        );
      })}
      <line x1={x(yi)} x2={x(yi)} y1={PAD.t} y2={H - PAD.b} stroke="#d80621" strokeWidth="1.5" />
      {years.map((yr, i) => (
        <text
          key={yr}
          x={x(i)}
          y={H - 12}
          textAnchor="middle"
          fontSize="11"
          fontWeight={yr === year ? 700 : 400}
          fill={yr === year ? "#d80621" : "rgba(10,15,30,0.55)"}
        >
          {yr}
        </text>
      ))}
    </svg>
  );
}

export default function RippleExplorer() {
  const { t, lang } = useLang();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [year, setYear] = useState(2026);

  useEffect(() => {
    fetch("/data/contagion.json")
      .then((r) => r.json())
      .then(setBundle)
      .catch(() => {});
  }, []);

  const fmtInt = useMemo(
    () => new Intl.NumberFormat(lang === "fr" ? "fr-CA" : "en-CA"),
    [lang]
  );

  if (!bundle) {
    return <p className="text-ink/60">…</p>;
  }

  const yearPts = ORDER.map((c) => {
    const p = (bundle.series[c] ?? []).find((q) => q.year === year);
    return { city: c, p };
  }).filter((x) => x.p);

  return (
    <div>
      <div className="rounded-[24px] border border-line bg-paper p-6 md:p-8">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h3 className="display text-[24px] md:text-[28px]">{t.ripple.indexTitle}</h3>
          <span className="rounded-full bg-ink px-4 py-1.5 text-[15px] font-semibold text-white">
            {year}
          </span>
        </div>
        <LineChart series={bundle.series} year={year} mode="index" />
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
          {ORDER.map((c) => (
            <span key={c} className="flex items-center gap-2 text-[13px] text-ink/70">
              <span className="inline-block h-[3px] w-6 rounded" style={{ background: COLORS[c] }} />
              {c}
            </span>
          ))}
        </div>
        <input
          type="range"
          min={2017}
          max={2026}
          step={1}
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value, 10))}
          className="mt-6 w-full accent-[#d80621]"
          aria-label={t.ripple.year}
        />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {yearPts.map(({ city, p }) => (
            <div key={city} className="rounded-2xl border border-line bg-paper-warm p-4">
              <p className="flex items-center gap-2 text-[13px] font-semibold">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: COLORS[city] }} />
                {city}
              </p>
              <p className="display mt-1 text-[30px]">{p!.index_2017.toFixed(1)}</p>
              <p className="text-[12px] text-ink/55">
                {city === "Toronto" ? "Toronto = 100 base" : `${p!.vs_toronto.toFixed(2)}x Toronto`}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-ink/55">{t.ripple.legendNote}</p>
      </div>

      <div className="mt-8 rounded-[24px] border border-line bg-paper p-6 md:p-8">
        <h3 className="display text-[24px] md:text-[28px]">{t.ripple.catchupTitle}</h3>
        <div className="mt-4">
          <LineChart series={bundle.series} year={year} mode="catchup" />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
          {ORDER.filter((c) => c !== "Toronto").map((c) => (
            <span key={c} className="flex items-center gap-2 text-[13px] text-ink/70">
              <span className="inline-block h-[3px] w-6 rounded" style={{ background: COLORS[c] }} />
              {c}
            </span>
          ))}
        </div>
      </div>

      <h3 className="display mt-12 text-[28px] md:text-[32px]">{t.ripple.perCity}</h3>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bundle.cities.map((c) => {
          const r = bundle.ripple.find((x) => x.city === c.name);
          return (
            <div key={c.id} className="rounded-[20px] border border-line bg-paper p-6">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="display text-[22px]">{c.name}</h4>
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: COLORS[c.name] ?? "#9ca3af" }}
                />
              </div>
              <dl className="mt-4 space-y-2 text-[14px]">
                <div className="flex justify-between gap-2">
                  <dt className="text-ink/55">{t.ripple.distance}</dt>
                  <dd className="font-semibold">{c.distance_km ?? "–"} km</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-ink/55">{t.ripple.population}</dt>
                  <dd className="font-semibold">{c.population_2021 ? fmtInt.format(c.population_2021) : "–"}</dd>
                </div>
                {r && r.growth_2017_2026 != null && (
                  <div className="flex justify-between gap-2">
                    <dt className="text-ink/55">{t.ripple.growth}</dt>
                    <dd className="font-semibold text-canada">
                      {r.growth_2017_2026 > 0 ? "+" : ""}
                      {r.growth_2017_2026.toFixed(1)}%
                    </dd>
                  </div>
                )}
                {r && c.name !== "Toronto" && (
                  <>
                    <div className="flex justify-between gap-2">
                      <dt className="text-ink/55">{t.ripple.cycle}</dt>
                      <dd className="font-semibold">{r.max_corr.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-ink/55">{t.ripple.lead}</dt>
                      <dd className="font-semibold">
                        {r.best_lag_months} {t.ripple.months}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
              {!c.nhpi_coverage && (
                <p className="mt-4 rounded-xl bg-muted p-3 text-[13px] text-ink/60">{t.ripple.noNhpi}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
