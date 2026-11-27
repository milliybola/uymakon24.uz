/**
 * Namuna e’lonlar: API_BASE berilmagan muhitda (dev/preview) sayt shular bilan ishlaydi.
 * Backend ulanganda bu fayl ishlatilmaydi.
 */
import type { Buyer, ListingCard, ListingDetail } from "./types";

type Seed = [
  code: number,
  title: string,
  price: number,
  currency: "UZS" | "USD",
  deal: "sale" | "rent" | "daily",
  category: ListingCard["category"],
  mahalla: string,
  rooms: number | null,
  area: number | null,
  sotix: number | null,
  featured: boolean,
  oldPrice: number | null,
  hoursAgo: number,
  lat: number,
  lng: number,
];

const SEEDS: Seed[] = [
  [10482, "5 xonali hovli, 6 sotix, markazda", 850e6, "UZS", "sale", "hovli", "Markaz", 5, 140, 6, true, 920e6, 2, 40.0262, 67.5931],
  [10481, "3 xonali kvartira, yangi bino, 5/9", 48000, "USD", "sale", "kvartira", "Yangi shahar", 3, 78, null, true, null, 5, 40.0298, 67.5862],
  [10480, "Do‘kon, bozor yonida, 60 m²", 6e6, "UZS", "rent", "tijorat", "Bozor", null, 60, null, true, null, 9, 40.0241, 67.5978],
  [10479, "Yer uchastka 8 sotix, gaz va svet bor", 95e6, "UZS", "sale", "yer", "Mirzabek", null, null, 8, false, null, 20, 40.0183, 67.5824],
  [10478, "2 xonali kvartira ijaraga, oila uchun", 2.5e6, "UZS", "rent", "kvartira", "Markaz", 2, 52, null, false, null, 26, 40.0275, 67.5952],
  [10477, "4 xonali hovli, 5 sotix, yevro ta’mir", 420e6, "UZS", "sale", "hovli", "Qo‘ytosh", 4, 110, 5, false, 450e6, 30, 40.0335, 67.6041],
  [10476, "Kunlik uy, to‘y mehmonlari uchun", 350e3, "UZS", "daily", "hovli", "Markaz", 3, 90, 4, false, null, 40, 40.0249, 67.5905],
  [10475, "3 xonali hovli, Marjonbuloq yo‘lida", 310e6, "UZS", "sale", "hovli", "Marjonbuloq yo‘li", 3, 90, 4, false, null, 52, 40.0121, 67.5788],
  [10474, "6 xonali hovli, 8 sotix, ikki qavatli", 1.2e9, "UZS", "sale", "hovli", "Markaz", 6, 220, 8, true, null, 60, 40.0229, 67.5949],
  [10473, "1 xonali kvartira, ta’mirlangan, 2/4", 22000, "USD", "sale", "kvartira", "Yangi shahar", 1, 34, null, false, 24000, 75, 40.0307, 67.5887],
  [10472, "Ombor va ustaxona, 200 m²", 4e6, "UZS", "rent", "tijorat", "Sanoat zonasi", null, 200, null, false, null, 90, 40.0372, 67.5751],
  [10471, "Yer uchastka 12 sotix, yo‘l bo‘yida", 160e6, "UZS", "sale", "yer", "Qo‘ytosh", null, null, 12, false, null, 110, 40.0391, 67.6102],
  [10470, "Kunlik kvartira, 2 xonali, markazda", 250e3, "UZS", "daily", "kvartira", "Markaz", 2, 48, null, false, null, 130, 40.0268, 67.5917],
  [10469, "3 xonali kvartira ijaraga, mebelli", 3.5e6, "UZS", "rent", "kvartira", "Yangi shahar", 3, 70, null, false, null, 150, 40.0288, 67.5841],
  [10468, "Savdo do‘koni, 40 m², sotiladi", 35000, "USD", "sale", "tijorat", "Bozor", null, 40, null, false, null, 170, 40.0236, 67.5991],
  [10467, "2 xonali hovli, 4 sotix", 210e6, "UZS", "sale", "hovli", "Mirzabek", 2, 60, 4, false, null, 200, 40.0171, 67.5851],
];

/** Namuna sanalar qat’iy: build vaqtiga bog‘liq bo‘lmasin */
const BASE = Date.parse("2026-11-27T12:00:00+05:00");

export const MOCK_LISTINGS: ListingCard[] = SEEDS.map((s) => {
  const [code, title, price, currency, deal, category, mahalla, rooms, area, sotix, featured, oldPrice, h, lat, lng] = s;
  return {
    code,
    title,
    price,
    currency,
    price_uzs: currency === "USD" ? price * 12800 : price,
    is_negotiable: code % 3 === 0,
    deal_type: deal === "sale" ? "sale" : "rent",
    rent_period: deal === "sale" ? "" : deal === "daily" ? "daily" : "monthly",
    category,
    mahalla,
    rooms,
    area_m2: area == null ? null : String(area),
    land_area_sotix: sotix == null ? null : String(sotix),
    thumb: null,
    blurhash: "",
    images_count: 4 + (code % 9),
    is_featured: featured,
    status: "active",
    published_at: new Date(BASE - h * 3600e3).toISOString(),
    lat: String(lat),
    lng: String(lng),
    old_price: oldPrice,
  };
});

export function mockDetail(code: number): ListingDetail | null {
  const l = MOCK_LISTINGS.find((x) => x.code === code);
  if (!l) return null;
  return {
    ...l,
    lat: l.lat ?? null,
    lng: l.lng ?? null,
    description:
      "Bu namuna e’lon: sayt backendga ulanmaguncha ko‘rsatiladi.\n\nAsfalt yo‘l bo‘yida, gaz, suv va svet bor. Hujjatlari tayyor. Ko‘rish uchun oldindan qo‘ng‘iroq qiling.",
    district: "G‘allaorol tumani",
    address: "Mustaqillik ko‘chasi",
    floor: l.category === "kvartira" ? 3 : l.category === "hovli" ? 1 : null,
    total_floors: l.category === "kvartira" ? 9 : l.category === "hovli" ? 1 : null,
    attributes: { renovation: "euro", gas: true, water: true, electricity: true, documents: true },
    contact_name: "UyMakon24",
    phone: "+998901234567",
    telegram_username: "",
    images: [],
    views_count: 40 + (l.code % 200),
    share_url: `/e/${l.code}`,
    updated_at: l.published_at,
  };
}

export const MOCK_BUYERS: Buyer[] = [
  { id: 1, intent: "buy", category: "hovli", budget: "400–600 mln so‘m", note: "4+ xona, markazga yaqin", created_at: new Date(BASE - 2 * 3600e3).toISOString() },
  { id: 2, intent: "rent", category: "kvartira", budget: "2–3 mln so‘m/oy", note: "2 xonali, oila uchun", created_at: new Date(BASE - 6 * 3600e3).toISOString() },
  { id: 3, intent: "buy", category: "yer", budget: "100–150 mln so‘m", note: "6–10 sotix, uy qurish uchun", created_at: new Date(BASE - 26 * 3600e3).toISOString() },
  { id: 4, intent: "rent", category: "tijorat", budget: "3–5 mln so‘m/oy", note: "Do‘kon, bozor atrofida", created_at: new Date(BASE - 50 * 3600e3).toISOString() },
  { id: 5, intent: "buy", category: "kvartira", budget: "25–35 ming $", note: "1–2 xonali, yangi bino", created_at: new Date(BASE - 75 * 3600e3).toISOString() },
];
