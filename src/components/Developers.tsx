"use client";

import { useLang } from "@/i18n";
import McpConnect from "./McpConnect";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/cities",
    desc: "Seven corridor cities: CMA, distance from downtown Toronto, 2021 population, NHPI coverage",
    response: `{
  "cities": [
    { "id": "hamilton", "name": "Hamilton",
      "distance_km": 58.7, "population_2021": 785184,
      "nhpi_coverage": true }
  ]}`,
  },
  {
    method: "GET",
    path: "/api/v1/ripple",
    desc: "Full dataset: cities, annual NHPI series rebased 2017=100, Toronto-relative catch-up, ripple analysis",
    response: `{
  "series": {
    "Kitchener-Waterloo": [
      { "year": 2017, "index_2017": 100.0,
        "vs_toronto": 1.0 },
      { "year": 2026, "index_2017": 146.7,
        "vs_toronto": 1.43 }
    ] } }`,
  },
];

export default function Developers() {
  const { t } = useLang();
  return (
    <section id="developers" className="bg-paper">
      <div className="mx-auto max-w-[1392px] px-6 py-20 md:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-canada">{t.developers.kicker}</p>
        <h2 className="display mt-4 max-w-[720px] text-[40px] md:text-[52px]">{t.developers.title}</h2>
        <p className="mt-5 max-w-[680px] text-[17px] leading-relaxed text-ink/70">{t.developers.body}</p>
        <h3 className="mt-12 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink/55">{t.developers.endpoints}</h3>
        <div className="mt-5 space-y-4">
          {endpoints.map((e) => (
            <div key={e.path} className="overflow-hidden rounded-[20px] border border-line">
              <div className="flex flex-wrap items-center gap-3 border-b border-line bg-paper-warm px-6 py-4">
                <span className="rounded-full bg-ink px-3 py-1 text-[12px] font-semibold text-white">{e.method}</span>
                <code className="min-w-0 flex-1 break-all font-mono text-[14px]">{e.path}</code>
                <a href={e.path} className="text-[14px] font-semibold text-canada hover:text-canada-dark">{t.developers.tryIt} →</a>
              </div>
              <div className="px-6 py-4">
                <p className="text-[14px] text-ink/65">{e.desc}</p>
                <pre className="mt-3 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-[12.5px] leading-relaxed text-white/85">{e.response}</pre>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/api/openapi.json" className="rounded-full border border-line px-6 py-3 text-[15px] font-semibold hover:border-ink">{t.developers.openapi}</a>
        </div>
        <div className="mt-16 rounded-[24px] border border-line bg-paper-warm p-6 md:p-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-canada">{t.developers.mcpTitle}</p>
          <p className="mt-3 max-w-[640px] text-[16px] text-ink/70">{t.developers.mcpBody}</p>
        </div>
        <div className="mt-8">
          <McpConnect
            config={{
              slug: "price-wave",
              displayName: "The Price Wave",
              exampleEn: "look up the Kitchener-Waterloo ripple record",
              exampleFr: "cherche la fiche de vague de Kitchener-Waterloo",
            }}
          />
        </div>
      </div>
    </section>
  );
}
