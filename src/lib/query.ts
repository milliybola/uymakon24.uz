import type { CategorySlug, Deal, ListingQuery } from "./types";

type SP = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const CATS = new Set(["hovli", "kvartira", "yer", "tijorat"]);
const posInt = (v: string) => (/^\d{1,13}$/.test(v) && +v > 0 ? +v : undefined);

/** URL parametrlari → so‘rov. Noto‘g‘ri qiymatlar e’tiborsiz qoldiriladi. */
export function parseQuery(sp: SP): ListingQuery {
  const deal = one(sp.deal);
  const sort = one(sp.sort);
  const rooms = one(sp.rooms);
  return {
    deal: deal === "rent" || deal === "daily" ? deal : "sale",
    category: CATS.has(one(sp.cat)) ? (one(sp.cat) as CategorySlug) : undefined,
    q: one(sp.q).trim().slice(0, 80) || undefined,
    rooms: /^(\d\+?)(,\d\+?)*$/.test(rooms) ? rooms : undefined,
    price_min: posInt(one(sp.min)),
    price_max: posInt(one(sp.max)),
    owner: one(sp.owner) === "1" || undefined,
    sort: sort === "cheap" || sort === "expensive" ? sort : undefined,
    page: posInt(one(sp.page)),
  };
}

/** So‘rov → URL ("/?deal=rent&cat=kvartira"). page doim tushib qoladi. */
export function toHref(q: ListingQuery, base = "/") {
  const p = new URLSearchParams();
  if (q.deal !== "sale") p.set("deal", q.deal);
  if (q.category) p.set("cat", q.category);
  if (q.q) p.set("q", q.q);
  if (q.rooms) p.set("rooms", q.rooms);
  if (q.price_min) p.set("min", String(q.price_min));
  if (q.price_max) p.set("max", String(q.price_max));
  if (q.owner) p.set("owner", "1");
  if (q.sort) p.set("sort", q.sort);
  return p.size ? `${base}?${p}` : base;
}

export const withDeal = (q: ListingQuery, deal: Deal): ListingQuery => ({
  ...q,
  deal,
  // yer faqat sotuvda bo‘ladi
  category: deal !== "sale" && q.category === "yer" ? undefined : q.category,
});
