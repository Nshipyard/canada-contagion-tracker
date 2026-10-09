"use client";

import { useLang } from "@/i18n";

export default function Showcase() {
  const { t } = useLang();
  return (
    <section id="findings" className="bg-paper-warm">
      <div className="mx-auto max-w-[1392px] px-6 py-20 md:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-canada">{t.findings.kicker}</p>
        <h2 className="display mt-4 max-w-[720px] text-[40px] md:text-[52px]">{t.findings.title}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {t.findings.items.map((f, i) => (
            <article
              key={i}
              className={`rounded-[24px] border border-line bg-paper p-7 md:p-9 ${
                i === t.findings.items.length - 1 ? "md:col-span-2" : ""
              }`}
            >
              <p className="display text-[15px] font-semibold uppercase tracking-[0.1em] text-canada">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="display mt-3 text-[26px] md:text-[30px]">{f.title}</h3>
              <p className="mt-4 text-[16px] leading-relaxed text-ink/70">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
