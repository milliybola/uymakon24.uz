import type { Metadata } from "next";

import { LeadForm } from "@/components/LeadForm";
import { formatPhone, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "E’lon berish",
  description: "G‘allaorolda uy, yer yoki do‘koningizni sotish yoki ijaraga berish uchun ariza qoldiring.",
  alternates: { canonical: "/elon-berish" },
};

const STEPS = [
  ["1", "Ariza qoldirasiz", "Ism, telefon va mulk haqida qisqacha."],
  ["2", "Biz bog‘lanamiz", "Ma’lumot va rasmlarni aniqlashtiramiz."],
  ["3", "E’lon joylanadi", "Xaridorlar sizga to‘g‘ridan-to‘g‘ri qo‘ng‘iroq qiladi."],
];

export default function SellPage() {
  return (
    <div className="bg-gradient-to-b from-brand-50 to-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1fr_1.1fr] md:py-14">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">E’lon berish</h1>
          <p className="mt-3 text-lg text-slate-600">
            Mulkingizni sotmoqchi yoki ijaraga bermoqchimisiz? Yoki o‘zingiz uy izlayapsizmi? Ariza qoldiring, biz siz bilan bog‘lanamiz.
          </p>
          <ol className="mt-6 grid gap-3">
            {STEPS.map(([n, t, d]) => (
              <li key={n} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand font-bold text-white">{n}</span>
                <span>
                  <b>{t}</b>
                  <span className="block text-sm text-slate-500">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          {(site.phone || site.telegram) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {site.phone && (
                <a href={`tel:${site.phone}`} className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 font-bold">
                  📞 {formatPhone(site.phone)}
                </a>
              )}
              {site.telegram && (
                <a href={`https://t.me/${site.telegram}`} target="_blank" rel="noopener" className="rounded-xl bg-[#229ed9] px-4 py-2.5 font-bold text-white">
                  ✈ Telegram
                </a>
              )}
            </div>
          )}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-7">
          <LeadForm />
        </div>
      </div>
    </div>
  );
}
