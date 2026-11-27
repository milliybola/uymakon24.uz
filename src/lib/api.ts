import "server-only";

import { cacheLife } from "next/cache";

import { MOCK_BUYERS, MOCK_LISTINGS, mockDetail } from "./mock";
import type { Buyer, Deal, ListingCard, ListingDetail, ListingQuery, Page } from "./types";

/** API_BASE berilmasa, sayt namuna e’lonlar bilan ishlaydi (dev/preview uchun). */
const API = (process.env.API_BASE || "").replace(/\/+$/, "");
export const usingMock = !API;
export const PAGE_SIZE = 20;

async function get<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") qs.set(k, String(v));
  const url = `${API}/${path}${qs.size ? `?${qs}` : ""}`;
  const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(10_000) });
  if (res.status === 404) throw new NotFound();
  if (!res.ok) throw new Error(`API ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

export class NotFound extends Error {}

const dealParams = (deal: Deal) =>
  deal === "sale" ? { deal_type: "sale" } : { deal_type: "rent", rent_period: deal === "daily" ? "daily" : "monthly" };

const matchesDeal = (l: ListingCard, deal: Deal) =>
  deal === "sale" ? l.deal_type === "sale" : l.deal_type === "rent" && (l.rent_period === "daily") === (deal === "daily");

const ORDERING = { new: "-published_at", cheap: "price_uzs", expensive: "-price_uzs" } as const;

function mockFilter(q: ListingQuery) {
  let list = MOCK_LISTINGS.filter((l) => matchesDeal(l, q.deal));
  if (q.category) list = list.filter((l) => l.category === q.category);
  if (q.q) {
    const s = q.q.toLowerCase().replace(/^#/, "");
    list = list.filter((l) => l.title.toLowerCase().includes(s) || String(l.code) === s || l.mahalla?.toLowerCase().includes(s));
  }
  if (q.rooms) {
    const parts = q.rooms.split(",");
    list = list.filter((l) => l.rooms != null && parts.some((p) => (p.endsWith("+") ? l.rooms! >= +p.slice(0, -1) : l.rooms === +p)));
  }
  if (q.price_min) list = list.filter((l) => l.price_uzs >= q.price_min!);
  if (q.price_max) list = list.filter((l) => l.price_uzs <= q.price_max!);
  const sort = q.sort ?? "new";
  return [...list].sort((a, b) =>
    sort === "new" ? b.published_at.localeCompare(a.published_at) : sort === "cheap" ? a.price_uzs - b.price_uzs : b.price_uzs - a.price_uzs,
  );
}

export async function getListings(q: ListingQuery): Promise<Page<ListingCard>> {
  "use cache";
  cacheLife("minutes");
  const page = q.page ?? 1;
  if (usingMock) {
    const all = mockFilter(q);
    const results = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return { count: all.length, next: all.length > page * PAGE_SIZE ? String(page + 1) : null, results };
  }
  return get<Page<ListingCard>>("listings", {
    ...dealParams(q.deal),
    category: q.category,
    q: q.q,
    rooms: q.rooms,
    price_min: q.price_min,
    price_max: q.price_max,
    ordering: ORDERING[q.sort ?? "new"],
    page,
    page_size: PAGE_SIZE,
  });
}

export async function getFeatured(deal: Deal): Promise<ListingCard[]> {
  "use cache";
  cacheLife("minutes");
  if (usingMock) return MOCK_LISTINGS.filter((l) => l.is_featured && matchesDeal(l, deal));
  const data = await get<Page<ListingCard>>("listings", { ...dealParams(deal), featured: "true", page_size: 10 });
  return data.results;
}

/** Barcha faol e’lonlar soni (sarlavhadagi "jami N e’lon") */
export async function getTotal(): Promise<number> {
  "use cache";
  cacheLife("minutes");
  if (usingMock) return MOCK_LISTINGS.length;
  return (await get<Page<ListingCard>>("listings", { page_size: 1 })).count;
}

export async function getListing(code: number): Promise<ListingDetail | null> {
  "use cache";
  cacheLife("minutes");
  if (usingMock) return mockDetail(code);
  try {
    return await get<ListingDetail>(`listings/${code}`);
  } catch (e) {
    if (e instanceof NotFound) return null;
    throw e;
  }
}

export async function getSimilar(code: number): Promise<ListingCard[]> {
  "use cache";
  cacheLife("minutes");
  if (usingMock) {
    const me = MOCK_LISTINGS.find((l) => l.code === code);
    if (!me) return [];
    const same = MOCK_LISTINGS.filter((l) => l.code !== code && l.category === me.category);
    return (same.length >= 2 ? same : MOCK_LISTINGS.filter((l) => l.code !== code)).slice(0, 4);
  }
  return (await get<{ results: ListingCard[] }>(`listings/${code}/similar`)).results.slice(0, 4);
}

/** Sevimlilar: brauzerda saqlangan kodlar bo‘yicha */
export async function getByCodes(codes: number[]): Promise<ListingCard[]> {
  if (!codes.length) return [];
  if (usingMock) return MOCK_LISTINGS.filter((l) => codes.includes(l.code));
  return (await get<{ results: ListingCard[] }>("listings", { ids: codes.slice(0, 50).join(",") })).results;
}

/** Xarita uchun: koordinatasi bor e’lonlar */
export async function getMapListings(deal: Deal): Promise<ListingCard[]> {
  "use cache";
  cacheLife("minutes");
  const list = usingMock ? MOCK_LISTINGS.filter((l) => matchesDeal(l, deal)) : await get<ListingCard[]>("listings/map", dealParams(deal));
  return list.filter((l) => l.lat != null && l.lng != null);
}

/** Xaridorlar so‘rovlari: admin tasdiqlaganlari, shaxsiy ma’lumotsiz. Bo‘sh bo‘lsa, blok ko‘rinmaydi. */
export async function getBuyers(): Promise<Buyer[]> {
  "use cache";
  cacheLife("minutes");
  return usingMock ? MOCK_BUYERS : get<Buyer[]>("buyers");
}

/** Sitemap uchun barcha faol e’lonlar */
export async function getSitemapEntries(): Promise<{ code: number; updated_at: string }[]> {
  "use cache";
  cacheLife("hours");
  if (usingMock) return MOCK_LISTINGS.map((l) => ({ code: l.code, updated_at: l.published_at }));
  return get("listings/sitemap");
}
