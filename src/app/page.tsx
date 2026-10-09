"use client";

import { useLang } from "@/i18n";
import { Banner, Nav, Footer } from "@/components/chrome";
import RippleExplorer from "@/components/RippleExplorer";
import Showcase from "@/components/Showcase";
import Methodology from "@/components/Methodology";
import Developers from "@/components/Developers";

function Hero() {
  const { t } = useLang();
  return (
    <section id="top" className="bg-paper">
      <div className="mx-auto max-w-[1392px] px-6 pb-16 pt-16 md:pb-24 md:pt-24">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-canada">{t.hero.kicker}</p>
        <h1 className="display mt-5 max-w-[880px] text-[52px] md:text-[84px]">{t.hero.title}</h1>
        <p className="mt-6 max-w-[680px] text-[19px] leading-relaxed text-ink/70 md:text-[21px]">{t.hero.sub}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#ripple" className="rounded-full bg-canada px-7 py-3.5 text-[16px] font-semibold text-white hover:bg-canada-dark">
            {t.hero.cta1}
          </a>
          <a href="#methodology" className="rounded-full border border-line px-7 py-3.5 text-[16px] font-semibold hover:border-ink">
            {t.hero.cta2}
          </a>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {t.stats.map((s) => (
            <div key={s.value} className="bg-paper p-7">
              <p className="display text-[44px] text-canada">{s.value}</p>
              <p className="mt-2 text-[15px] leading-snug text-ink/65">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RippleSection() {
  const { t } = useLang();
  return (
    <section id="ripple" className="bg-paper-warm">
      <div className="mx-auto max-w-[1392px] px-6 py-20 md:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-canada">{t.ripple.kicker}</p>
        <h2 className="display mt-4 max-w-[720px] text-[40px] md:text-[52px]">{t.ripple.title}</h2>
        <p className="mt-5 max-w-[720px] text-[17px] leading-relaxed text-ink/70">{t.ripple.body}</p>
        <div className="mt-10">
          <RippleExplorer />
        </div>
      </div>
    </section>
  );
}

function Downloads() {
  const { t } = useLang();
  return (
    <section id="data" className="bg-paper">
      <div className="mx-auto max-w-[1392px] px-6 py-20 md:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-canada">{t.downloads.kicker}</p>
        <h2 className="display mt-4 max-w-[720px] text-[40px] md:text-[52px]">{t.downloads.title}</h2>
        <p className="mt-5 max-w-[680px] text-[17px] leading-relaxed text-ink/70">{t.downloads.body}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {t.downloads.files.map((f) => (
            <div key={f.name} className="flex items-center justify-between gap-4 rounded-[20px] border border-line p-6">
              <div>
                <p className="font-mono text-[16px] font-semibold">{f.name}</p>
                <p className="mt-1 text-[14px] text-ink/60">{f.desc}</p>
              </div>
              <a
                href={`/data/${f.name}`}
                download
                className="shrink-0 rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-white hover:bg-canada"
              >
                {t.downloads.download}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Banner />
      <Nav />
      <main className="flex-1">
        <Hero />
        <RippleSection />
        <Showcase />
        <Methodology />
        <Developers />
        <Downloads />
      </main>
      <Footer />
    </>
  );
}
