import { LeadForm } from "@/components/LeadForm";
import { Logo } from "@/components/Logo";
import { PhoneMockup } from "@/components/PhoneMockup";
import { formatPhone, site } from "@/lib/site";

const categories = [
  { icon: "🏡", title: "Hovli va uylar", text: "Xususiy uylar, hovli-joylar, tomorqasi bilan", deals: "Sotuv · Ijara" },
  { icon: "🏢", title: "Kvartiralar", text: "Yangi va ikkilamchi uylar, kunlik va oylik ijara", deals: "Sotuv · Ijara" },
  { icon: "🌄", title: "Yer uchastkalari", text: "Qurilish va dehqonchilik uchun yerlar, sotixlab", deals: "Sotuv" },
  { icon: "🏪", title: "Do‘kon va tijorat", text: "Do‘kon, ofis, ombor va boshqa tijorat joylari", deals: "Sotuv · Ijara" },
];

const features = [
  { icon: "🔎", title: "Qulay qidiruv", text: "Narx, xonalar soni, maydon va mahalla bo‘yicha saralang." },
  { icon: "📍", title: "Xaritada joylashuv", text: "Har bir e’lonning aniq manzili xaritada ko‘rsatiladi." },
  { icon: "📞", title: "To‘g‘ridan-to‘g‘ri aloqa", text: "Bir tugma bilan qo‘ng‘iroq qiling yoki Telegram’da yozing." },
  { icon: "🖼", title: "Sifatli rasmlar", text: "Ko‘p rasmli e’lonlar: mulkni uydan chiqmay ko‘rib chiqing." },
  { icon: "❤️", title: "Saqlanganlar", text: "Yoqqan e’lonlarni saqlab, keyin solishtiring." },
  { icon: "✅", title: "Tekshirilgan e’lonlar", text: "E’lonlar joylashdan oldin ko‘rib chiqiladi." },
];

const sellerSteps = [
  { t: "Ariza qoldiring", d: "Ism, raqam va mulkingiz haqida qisqacha yozing." },
  { t: "Biz bog‘lanamiz", d: "Mutaxassisimiz qo‘ng‘iroq qilib, ma’lumot va rasmlarni oladi." },
  { t: "E’loningiz joylanadi", d: "Xaridorlar sayt va ilova orqali to‘g‘ridan-to‘g‘ri sizga qo‘ng‘iroq qiladi." },
];

const buyerSteps = [
  { t: "Qidiring", d: "Sotuv yoki ijara, kategoriya va narxni tanlang." },
  { t: "Solishtiring", d: "Rasmlar, xarita va xususiyatlarni ko‘rib chiqing." },
  { t: "Bog‘laning", d: "Egasiga qo‘ng‘iroq qiling yoki Telegram’da yozing." },
];

const faq = [
  {
    q: "UyMakon24 qachon ishga tushadi?",
    a: "Tayyorgarlik yakuniy bosqichda. Ariza qoldirganlarga ishga tushgan kuni birinchi bo‘lib xabar beramiz.",
  },
  {
    q: "E’lonimni qanday joylashtiraman?",
    a: "Shu sahifadagi ariza shaklini to‘ldiring. Mutaxassisimiz siz bilan bog‘lanib, mulk haqidagi ma’lumot va rasmlarni oladi va e’lonni o‘zi joylashtiradi.",
  },
  {
    q: "Qaysi hududlar bo‘yicha e’lonlar bo‘ladi?",
    a: "Boshlanishiga G‘allaorol tumani: shahar, shaharchalar va qishloqlar. Keyinchalik boshqa tumanlar ham qo‘shiladi.",
  },
  {
    q: "Mobil ilova bo‘ladimi?",
    a: "Ha. Android ilova tayyorlanmoqda. Sayt va ilovada bir xil e’lonlar bo‘ladi.",
  },
  {
    q: "Telefon raqamim kimga ko‘rinadi?",
    a: "Ariza orqali yuborgan raqamingiz faqat siz bilan bog‘lanish uchun ishlatiladi va uchinchi shaxslarga berilmaydi.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: `${site.url}/icon.svg`,
      areaServed: "G‘allaorol tumani, Jizzax viloyati",
      ...(site.phone ? { telephone: site.phone } : {}),
      ...(site.telegram ? { sameAs: [`https://t.me/${site.telegram}`] } : {}),
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <Hero />
        <Categories />
        <HowItWorks />
        <Features />
        <Apply />
        <Faq />
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-5">
        <Logo />
        <nav className="hidden gap-7 text-[15px] font-semibold text-slate-600 md:flex">
          <a href="#kategoriyalar" className="hover:text-brand">Kategoriyalar</a>
          <a href="#qanday" className="hover:text-brand">Qanday ishlaydi</a>
          <a href="#imkoniyatlar" className="hover:text-brand">Imkoniyatlar</a>
          <a href="#savollar" className="hover:text-brand">Savollar</a>
        </nav>
        <a
          href="#ariza"
          className="ml-auto rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-700 sm:px-5"
        >
          Ariza qoldirish
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-700 to-brand-900 text-white">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-52 -left-32 size-[420px] rounded-full bg-white/5" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-brand-100 ring-1 ring-white/15">
            <span className="size-2 animate-pulse rounded-full bg-accent" />
            Tez orada · {site.region}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[56px]">
            {site.region}da uy, yer va do‘kon. <span className="text-brand-300">Sotuv va ijara</span> bitta joyda
          </h1>
          <p className="mt-5 max-w-xl text-lg text-brand-100/90">
            {site.name}: tumandagi ko‘chmas mulk e’lonlari uchun yangi sayt va mobil ilova. Ishga tushishidan oldin
            mulkingizni birinchilardan bo‘lib joylashtiring.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#ariza"
              className="rounded-2xl bg-white px-7 py-4 text-center text-lg font-bold text-brand-700 shadow-xl transition hover:bg-brand-50"
            >
              Mulkimni joylashtirmoqchiman
            </a>
            {site.telegram ? (
              <a
                href={`https://t.me/${site.telegram}`}
                target="_blank"
                rel="noopener"
                className="rounded-2xl px-7 py-4 text-center text-lg font-bold text-white ring-2 ring-white/30 transition hover:bg-white/10"
              >
                Telegram kanalimiz
              </a>
            ) : (
              <a
                href="#ariza"
                className="rounded-2xl px-7 py-4 text-center text-lg font-bold text-white ring-2 ring-white/30 transition hover:bg-white/10"
              >
                Uy qidiryapman
              </a>
            )}
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 text-brand-100">
            <div>
              <dt className="text-sm">Kategoriya</dt>
              <dd className="text-2xl font-extrabold text-white">4 xil</dd>
            </div>
            <div>
              <dt className="text-sm">Bitim turi</dt>
              <dd className="text-2xl font-extrabold text-white">Sotuv, ijara</dd>
            </div>
            <div>
              <dt className="text-sm">Platforma</dt>
              <dd className="text-2xl font-extrabold text-white">Sayt, ilova</dd>
            </div>
          </dl>
        </div>
        <div className="flex justify-center md:justify-end">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

function SectionHead({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-brand">{kicker}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-slate-600">{text}</p>}
    </div>
  );
}

function Categories() {
  return (
    <section id="kategoriyalar" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          kicker="Kategoriyalar"
          title="Har qanday mulk uchun"
          text="Uy-joydan tortib yer va do‘kongacha: sotuv ham, ijara ham bir platformada."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <div
              key={c.title}
              className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5"
            >
              <div className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-3xl transition group-hover:scale-110">
                {c.icon}
              </div>
              <h3 className="mt-5 text-xl font-bold">{c.title}</h3>
              <p className="mt-2 text-slate-600">{c.text}</p>
              <p className="mt-4 text-sm font-semibold text-brand">{c.deals}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps({ title, steps, tone }: { title: string; steps: { t: string; d: string }[]; tone: "brand" | "rent" }) {
  const color = tone === "brand" ? "bg-brand" : "bg-rent";
  return (
    <div className="rounded-3xl bg-white p-7 ring-1 ring-slate-200 sm:p-9">
      <h3 className="text-xl font-bold">{title}</h3>
      <ol className="mt-6 space-y-6">
        {steps.map((s, i) => (
          <li key={s.t} className="flex gap-4">
            <span className={`grid size-10 shrink-0 place-items-center rounded-full ${color} font-bold text-white`}>
              {i + 1}
            </span>
            <div>
              <p className="font-bold">{s.t}</p>
              <p className="mt-1 text-slate-600">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HowItWorks() {
  return (
    <section id="qanday" className="scroll-mt-20 bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead kicker="Qanday ishlaydi" title="Oddiy va tushunarli" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Steps title="🏷 Sotuvchi va ijaraga beruvchilar uchun" steps={sellerSteps} tone="brand" />
          <Steps title="🔑 Xaridor va ijarachilar uchun" steps={buyerSteps} tone="rent" />
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="imkoniyatlar" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          kicker="Imkoniyatlar"
          title="Mulk izlash endi oson"
          text="Bozorma-bozor yurish va e’lon izlab guruhlarni titkilash shart emas."
        />
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-2xl">{f.icon}</div>
              <div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-1 text-slate-600">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Apply() {
  return (
    <section id="ariza" className="scroll-mt-16 bg-gradient-to-b from-brand-50 to-white py-20">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 lg:grid-cols-[1fr_1.15fr]">
        <div className="lg:sticky lg:top-28">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">Ariza</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Birinchilardan bo‘ling</h2>
          <p className="mt-4 text-lg text-slate-600">
            Mulkingizni sotmoqchi yoki ijaraga bermoqchimisiz? Yoki o‘zingizga uy, yer, do‘kon qidiryapsizmi? Ariza
            qoldiring, biz siz bilan bog‘lanamiz.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Ishga tushgan kuni e’loningiz birinchilar qatorida bo‘ladi",
              "E’lonni o‘zimiz tayyorlaymiz va joylashtiramiz",
              "Mos mulk chiqsa, qidirayotganlarga xabar beramiz",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-slate-700">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-white">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>
          {(site.phone || site.telegram) && (
            <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-500">Savolingiz bo‘lsa</p>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 font-bold">
                {site.phone && (
                  <a href={`tel:${site.phone}`} className="hover:text-brand">
                    📞 {formatPhone(site.phone)}
                  </a>
                )}
                {site.telegram && (
                  <a href={`https://t.me/${site.telegram}`} target="_blank" rel="noopener" className="hover:text-brand">
                    ✈️ @{site.telegram}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
        <LeadForm />
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="savollar" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHead kicker="Savollar" title="Ko‘p beriladigan savollar" />
        <div className="mt-10 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
          {faq.map((f) => (
            <details key={f.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xl text-slate-500 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo dark />
          <p className="mt-3 text-sm">{site.region} tumanidagi uy, yer va do‘kon e’lonlari.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {site.phone && <a href={`tel:${site.phone}`} className="hover:text-white">{formatPhone(site.phone)}</a>}
          {site.telegram && (
            <a href={`https://t.me/${site.telegram}`} target="_blank" rel="noopener" className="hover:text-white">
              Telegram
            </a>
          )}
          <a href="/maxfiylik" className="hover:text-white">Maxfiylik siyosati</a>
        </div>
      </div>
      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        © 2026 {site.name}
      </div>
    </footer>
  );
}
