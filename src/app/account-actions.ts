"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { API, authFetch, clearToken, isMock, MOCK_TOKEN, setToken } from "@/lib/session";
import type { ListingImage, ListingInput } from "@/lib/types";

type Errors = Record<string, string>;

async function clientIp() {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
}

/** DRF xatolarini {maydon: matn} ko‘rinishiga keltiradi */
async function errorsOf(res: Response): Promise<Errors> {
  try {
    const data = await res.json();
    const out: Errors = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      out[k] = Array.isArray(v) ? String(v[0]) : typeof v === "string" ? v : JSON.stringify(v);
    }
    return out;
  } catch {
    return { detail: `Xatolik (${res.status}). Qayta urinib ko‘ring.` };
  }
}

const AUTH_LOST = { detail: "Kirish muddati tugagan. Qayta kiring." };

// ---------- Kirish ----------

export async function startLogin(): Promise<{ token: string; botUrl: string } | { error: string }> {
  if (isMock) return { token: MOCK_TOKEN, botUrl: "" };
  try {
    const res = await fetch(`${API}/auth/telegram/start`, {
      method: "POST",
      headers: { "X-Leads-Key": process.env.LEADS_API_KEY ?? "", "X-Client-IP": await clientIp() },
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 429) return { error: "Juda ko‘p urinish. Birozdan so‘ng qayta urinib ko‘ring." };
    if (!res.ok) return { error: "Hozir kirib bo‘lmadi. Birozdan so‘ng qayta urinib ko‘ring." };
    const d = await res.json();
    return { token: d.token, botUrl: d.bot_url };
  } catch {
    return { error: "Ulanishda xatolik. Qayta urinib ko‘ring." };
  }
}

export async function checkLogin(token: string): Promise<"ok" | "pending" | "expired"> {
  if (isMock) {
    await setToken(MOCK_TOKEN);
    return "ok";
  }
  try {
    const res = await fetch(`${API}/auth/telegram/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: String(token).slice(0, 64) }),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 410) return "expired";
    const d = await res.json();
    if (d.status === "ok" && d.token) {
      await setToken(d.token);
      return "ok";
    }
    return "pending";
  } catch {
    return "pending";
  }
}

export async function logout() {
  if (!isMock) await authFetch("auth/logout", { method: "POST" }).catch(() => null);
  await clearToken();
  redirect("/");
}

// ---------- E’lonlar ----------

/** Qoralamani saqlash: code bo‘lmasa yaratadi */
export async function saveListing(code: number | null, input: ListingInput): Promise<{ code?: number; errors?: Errors }> {
  if (isMock) return { code: code ?? 99001 };
  const res = await authFetch(code ? `me/listings/${code}` : "me/listings", {
    method: code ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res || res.status === 401) return { errors: AUTH_LOST };
  if (!res.ok) return { errors: await errorsOf(res) };
  return { code: (await res.json()).code };
}

export async function uploadImage(code: number, fd: FormData): Promise<{ image?: ListingImage & { id: number }; error?: string }> {
  const file = fd.get("image");
  if (!(file instanceof File) || file.size === 0) return { error: "Rasm tanlang." };
  if (isMock) return { image: { id: Date.now(), thumb: "/icon.svg", medium: "", large: "", width: 0, height: 0, blurhash: "" } };
  const body = new FormData();
  body.set("image", file, file.name || "photo.jpg");
  const res = await authFetch(`me/listings/${code}/images`, { method: "POST", body });
  if (!res || res.status === 401) return { error: AUTH_LOST.detail };
  if (!res.ok) return { error: (await errorsOf(res)).image ?? "Rasmni yuklab bo‘lmadi." };
  return { image: await res.json() };
}

export async function deleteImage(code: number, imageId: number) {
  if (isMock) return { ok: true };
  const res = await authFetch(`me/listings/${code}/images/${Number(imageId)}`, { method: "DELETE" });
  return { ok: !!res && res.ok };
}

export async function submitListing(code: number): Promise<{ ok: boolean; error?: string }> {
  if (isMock) return { ok: true };
  const res = await authFetch(`me/listings/${code}/submit`, { method: "POST" });
  if (!res || res.status === 401) return { ok: false, error: AUTH_LOST.detail };
  if (!res.ok) return { ok: false, error: (await errorsOf(res)).detail ?? "Yuborib bo‘lmadi." };
  return { ok: true };
}

export async function deleteListing(code: number) {
  if (isMock) return { ok: true };
  const res = await authFetch(`me/listings/${code}`, { method: "DELETE" });
  return { ok: !!res && res.ok };
}

export async function setListingStatus(code: number, status: "sold" | "rented" | "hidden" | "restore") {
  if (isMock) return { ok: true };
  const res = await authFetch(`me/listings/${code}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res || !res.ok) return { ok: false, error: res ? (await errorsOf(res)).detail : AUTH_LOST.detail };
  return { ok: true };
}
