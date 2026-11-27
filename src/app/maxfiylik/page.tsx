import type { Metadata } from "next";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Maxfiylik siyosati",
  alternates: { canonical: "/maxfiylik" },
};

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 leading-relaxed text-slate-700">
        <h1 className="text-3xl font-extrabold text-slate-900">Maxfiylik siyosati</h1>
        <p className="mt-6">
          {site.name} ({site.url.replace(/^https?:\/\//, "")}) foydalanuvchilarning shaxsiy ma’lumotlarini hurmat qiladi.
          Bu sahifada qaysi ma’lumotlarni yig‘ishimiz va ulardan qanday foydalanishimiz yozilgan.
        </p>
        <h2 className="mt-8 text-xl font-bold text-slate-900">Qanday ma’lumot yig‘iladi</h2>
        <p className="mt-2">
          Ariza shakli orqali siz yuborgan ism, telefon raqam, mulk turi, manzil va izoh. Shuningdek, suiiste’mollarning
          oldini olish uchun so‘rov yuborilgan IP manzil saqlanadi.
        </p>
        <h2 className="mt-8 text-xl font-bold text-slate-900">Ma’lumot nima uchun ishlatiladi</h2>
        <p className="mt-2">
          Faqat siz bilan bog‘lanish, e’loningizni joylashtirish yoki sizga mos mulk haqida xabar berish uchun. Ma’lumotlar
          uchinchi shaxslarga sotilmaydi va berilmaydi.
        </p>
        <h2 className="mt-8 text-xl font-bold text-slate-900">Ma’lumotni o‘chirish</h2>
        <p className="mt-2">
          Arizangizni o‘chirishni xohlasangiz, biz bilan bog‘laning
          {site.telegram ? ` (Telegram: @${site.telegram})` : ""}
          {site.phone ? ` yoki ${site.phone} raqamiga qo‘ng‘iroq qiling` : ""}.
        </p>
      </div>
  );
}
