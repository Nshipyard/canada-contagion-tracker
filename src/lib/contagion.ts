import fs from "node:fs";
import path from "node:path";

const DATA = path.join(process.cwd(), "data");

export interface City {
  id: string;
  name: string;
  cma: string;
  distance_km: number | null;
  population_2021: number | null;
  nhpi_coverage: boolean;
}
export interface SeriesPoint {
  year: number;
  index_2017: number;
  toronto_index_2017: number;
  vs_toronto: number;
}
export interface RippleRow {
  city: string;
  best_lag_months: number;
  max_corr: number;
  growth_2017_2026: number | null;
  growth_2017_2021: number | null;
  growth_2021_2026: number | null;
  growth_2000_2010: number | null;
  growth_2010_2020: number | null;
}
export interface ContagionData {
  meta: { title: string; sources: string[]; gaps: string[]; built: string };
  cities: City[];
  series: Record<string, SeriesPoint[]>;
  ripple: RippleRow[];
}

let cache: ContagionData | null = null;

export function getData(): ContagionData {
  if (!cache) {
    cache = JSON.parse(fs.readFileSync(path.join(DATA, "contagion.json"), "utf-8")) as ContagionData;
  }
  return cache;
}

export function lookupCity(id: string): (City & { ripple: RippleRow | null }) | null {
  const d = getData();
  const c = d.cities.find((x) => x.id === id);
  if (!c) return null;
  return { ...c, ripple: d.ripple.find((r) => r.city === c.name) ?? null };
}

export function citySeries(id: string): { city: City; points: SeriesPoint[] } | null {
  const d = getData();
  const c = d.cities.find((x) => x.id === id);
  if (!c || !d.series[c.name]) return null;
  return { city: c, points: d.series[c.name] };
}
