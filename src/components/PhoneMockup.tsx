/** Hero'dagi telefon: ilovaning soddalashtirilgan ko‘rinishi (rasm faylsiz, faqat CSS). */
const items = [
  { p: "65 000 $", t: "4 xonali hovli, 6 sotix", m: "Markaz", g: "from-[#7c9a6b] to-[#d8c3a5]", top: true },
  { p: "3 mln so‘m/oy", t: "2 xonali kvartira", m: "Markaz", g: "from-[#8fa3b8] to-[#e7d9c4]" },
  { p: "18 000 $", t: "Yer uchastkasi, 10 sotix", m: "Marjonbuloq", g: "from-[#a47551] to-[#e6ccb2]" },
];

export function PhoneMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[56px] bg-brand-300/20 blur-2xl" />
      <div className="relative w-[280px] rotate-2 rounded-[44px] bg-slate-900 p-3 shadow-2xl sm:w-[300px]">
        <div className="absolute left-1/2 top-3 z-10 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
        <div className="overflow-hidden rounded-[34px] bg-slate-50 text-slate-900">
          <div className="bg-white px-4 pb-3 pt-9">
            <p className="text-lg font-extrabold">
              UyMakon<span className="text-brand">24</span>
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-brand px-3 py-2.5 text-xs font-bold text-white">Sotib olish</div>
              <div className="rounded-xl bg-rent px-3 py-2.5 text-xs font-bold text-white">Ijaraga olish</div>
            </div>
            <div className="mt-3 flex justify-between px-1 text-[20px]">
              <span>🏡</span>
              <span>🏢</span>
              <span>🌄</span>
              <span>🏪</span>
            </div>
          </div>
          <div className="space-y-2.5 p-3">
            {items.map((i) => (
              <div key={i.t} className="flex gap-2.5 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-100">
                <div className={`relative h-16 w-20 shrink-0 rounded-xl bg-gradient-to-br ${i.g}`}>
                  {i.top && (
                    <span className="absolute left-1 top-1 rounded bg-accent px-1 text-[9px] font-extrabold text-white">
                      TOP
                    </span>
                  )}
                </div>
                <div className="min-w-0 py-0.5">
                  <p className="text-sm font-extrabold">{i.p}</p>
                  <p className="truncate text-xs text-slate-700">{i.t}</p>
                  <p className="text-[11px] text-slate-400">{i.m}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-around border-t border-slate-200 bg-white py-2.5 text-lg text-slate-400">
            <span className="text-brand">⌂</span>
            <span>⌕</span>
            <span>♡</span>
            <span>☺</span>
          </div>
        </div>
      </div>
    </div>
  );
}
