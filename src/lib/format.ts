import type { CategorySlug, Deal, ListingCard } from "./types";

const nbsp = (n: number) => Math.round(n).toLocaleString("ru-RU").replace(/\s/g, " ");

function short(n: number) {
  const f = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1).replace(".", ","));
  if (n >= 1e9) return `${f(Math.round(n / 1e8) / 10)} mlrd`;
  if (n >= 1e6) return `${f(Math.round(n / 1e5) / 10)} mln`;
  if (n >= 1e3) return `${nbsp(n / 1e3)} ming`;
  return String(n);
}

export function money(price: number, currency: "UZS" | "USD") {
  return currency === "USD" ? `${nbsp(price)} $` : `${short(price)} so‘m`;
}

export function period(l: Pick<ListingCard, "deal_type" | "rent_period">) {
  if (l.deal_type !== "rent") return "";
  return l.rent_period === "daily" ? "/kun" : "/oy";
}

export const priceText = (l: ListingCard) => money(l.price, l.currency) + period(l);

/** Xarita yorlig‘i uchun qisqa narx: "850 mln", "48 000 $" */
export function pinPrice(l: ListingCard) {
  const base = l.currency === "USD" ? `${nbsp(l.price)} $` : short(l.price);
  return base + period(l);
}

export const CATEGORIES: { slug: CategorySlug; name: string; icon: string }[] = [
  { slug: "hovli", name: "Hovli", icon: "🏡" },
  { slug: "kvartira", name: "Kvartira", icon: "🏢" },
  { slug: "yer", name: "Yer", icon: "🌱" },
  { slug: "tijorat", name: "Do‘kon", icon: "🏪" },
];
export const categoryName = (s: string) => CATEGORIES.find((c) => c.slug === s)?.name ?? s;

const RENOVATION: Record<string, string> = { none: "Ta’mirsiz", cosmetic: "Kosmetik ta’mir", euro: "Yevro ta’mir", new: "Yangi qurilgan" };
const AMENITIES: Record<string, string> = { gas: "Gaz", water: "Suv", electricity: "Svet", sewage: "Kanalizatsiya", furnished: "Mebelli", documents: "Hujjatlari bor" };

/** Backenddagi attributes → jadval qatorlari (ilovadagi nomlar bilan bir xil) */
export function attributeRows(attrs: Record<string, unknown> | null | undefined): [string, string][] {
  const rows: [string, string][] = [];
  const a = attrs ?? {};
  if (typeof a.renovation === "string" && a.renovation) rows.push(["Ta’mir", RENOVATION[a.renovation] ?? a.renovation]);
  const yes = Object.keys(AMENITIES).filter((k) => a[k] === true).map((k) => AMENITIES[k]);
  if (yes.length) rows.push(["Qulayliklar", yes.join(", ")]);
  return rows;
}

export const DEALS: { key: Deal; name: string }[] = [
  { key: "sale", name: "Sotuv" },
  { key: "rent", name: "Ijara" },
  { key: "daily", name: "Kunlik" },
];
export const dealOf = (l: Pick<ListingCard, "deal_type" | "rent_period">): Deal =>
  l.deal_type === "sale" ? "sale" : l.rent_period === "daily" ? "daily" : "rent";
export const dealName = (d: Deal) => DEALS.find((x) => x.key === d)!.name;

/** "2 soat oldin" ko‘rinishi. now — so‘rov vaqti (prerenderda Date ishlatilmaydi). */
export function ago(iso: string, now: number) {
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))} daqiqa oldin`;
  if (s < 86400) return `${Math.floor(s / 3600)} soat oldin`;
  const d = Math.floor(s / 86400);
  if (d < 30) return d === 1 ? "kecha" : `${d} kun oldin`;
  return new Date(iso).toLocaleDateString("ru-RU");
}

export function isNew(iso: string, now: number) {
  return now - new Date(iso).getTime() < 3 * 86400 * 1000;
}

const num = (v: string | null) => (v == null ? null : Number(v));

/** Kartochkadagi qisqa ma’lumotlar: "🛏 5 · 📐 140 m² · 🌱 6 sotix" */
export function facts(l: ListingCard) {
  const out: string[] = [];
  if (l.rooms) out.push(`${l.rooms} xona`);
  const a = num(l.area_m2);
  if (a) out.push(`${a} m²`);
  const s = num(l.land_area_sotix);
  if (s) out.push(`${s} sotix`);
  return out;
}
