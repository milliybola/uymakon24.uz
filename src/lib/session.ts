import "server-only";

import { cookies } from "next/headers";

import { MOCK_LISTINGS } from "./mock";
import type { Mahalla, MyListing } from "./types";

/** Backend API token httpOnly cookie’da saqlanadi: brauzer JavaScript’i uni o‘qiy olmaydi. */
export const TOKEN_COOKIE = "um24_token";
export const API = (process.env.API_BASE || "").replace(/\/+$/, "");
export const isMock = !API;
export const MOCK_TOKEN = "mock";

export async function getToken() {
  return (await cookies()).get(TOKEN_COOKIE)?.value ?? null;
}

export async function setToken(token: string) {
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
}

export async function clearToken() {
  (await cookies()).delete(TOKEN_COOKIE);
}

/** Token bilan backendga so‘rov. Token yaroqsiz bo‘lsa (401/403), cookie o‘chiriladi. */
export async function authFetch(path: string, init: RequestInit = {}) {
  const token = await getToken();
  if (!token) return null;
  const res = await fetch(`${API}/${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init.headers ?? {}), Authorization: `Token ${token}` },
    signal: AbortSignal.timeout(30_000),
    cache: "no-store",
  });
  return res;
}

const MOCK_MINE: MyListing[] = [
  { ...MOCK_LISTINGS[5], status: "pending", reject_reason: "", phone_clicks: 0, views_count: 0 },
  { ...MOCK_LISTINGS[4], status: "active", reject_reason: "", phone_clicks: 12, views_count: 184 },
  { ...MOCK_LISTINGS[3], status: "rejected", reject_reason: "Rasmlar aniq emas. Yorug‘ joyda qayta suratga oling.", phone_clicks: 0, views_count: 0 },
].map((l) => ({ ...l, description: "", attributes: {}, address: "", contact_name: "Akmal", phone: "+998901234567", telegram_username: "", images: [], mahalla: 1, floor: null, total_floors: null, district: "gallaorol" })) as MyListing[];

/** null — kirmagan */
export async function getMyListings(): Promise<MyListing[] | null> {
  const token = await getToken();
  if (!token) return null;
  if (isMock) return MOCK_MINE;
  const res = await authFetch("me/listings");
  if (!res || res.status === 401 || res.status === 403) return null;
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function getMyListing(code: number): Promise<MyListing | "auth" | null> {
  const token = await getToken();
  if (!token) return "auth";
  if (isMock) return MOCK_MINE.find((l) => l.code === code) ?? MOCK_MINE[0];
  const res = await authFetch(`me/listings/${code}`);
  if (!res || res.status === 401 || res.status === 403) return "auth";
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function getMahallas(): Promise<Mahalla[]> {
  if (isMock) {
    return ["Markaz", "Yangi shahar", "Mirzabek", "Qo‘ytosh", "Marjonbuloq yo‘li", "Bozor"].map((name, i) => ({ id: i + 1, name }));
  }
  const res = await fetch(`${API}/mahallas?district=gallaorol`, { signal: AbortSignal.timeout(10_000) });
  return res.ok ? res.json() : [];
}

export type Me = { name: string; phone: string; telegram_username: string };

/** Kirgan foydalanuvchi; kirmagan yoki token yaroqsiz bo‘lsa null */
export async function getMe(): Promise<Me | null> {
  const token = await getToken();
  if (!token) return null;
  if (isMock) return { name: "Sinov foydalanuvchi", phone: "+998901234567", telegram_username: "" };
  const res = await authFetch("me");
  if (!res || !res.ok) return null;
  return res.json();
}
