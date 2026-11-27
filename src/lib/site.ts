/** Sayt sozlamalari. Hammasi .env orqali o‘zgartiriladi (Vercel → Settings → Environment Variables). */
export const site = {
  name: "UyMakon24",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://uymakon24.uz").replace(/\/$/, ""),
  region: "G‘allaorol",
  /** Telegram kanal yoki admin username (@ belgisisiz). Bo‘sh bo‘lsa, tugmalar ko‘rinmaydi. */
  telegram: process.env.NEXT_PUBLIC_TELEGRAM || "",
  /** Aloqa telefoni, masalan +998901234567. Bo‘sh bo‘lsa, ko‘rinmaydi. */
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  description:
    "G‘allaorol tumanidagi uy, kvartira, yer va do‘kon e’lonlari: sotuv va ijara bitta joyda. Tez orada ishga tushadi.",
};

export function formatPhone(p: string) {
  const d = p.replace(/\D/g, "");
  if (d.length !== 12) return p;
  return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`;
}

/** Faqat Vercel production (prod branch) indekslanadi; dev/preview Google'ga chiqmaydi. */
export const isProduction = process.env.VERCEL_ENV === "production";
