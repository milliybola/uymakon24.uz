"use server";

import { headers } from "next/headers";

import { getByCodes, getListings, usingMock } from "@/lib/api";
import { parseQuery } from "@/lib/query";
import type { ListingCard } from "@/lib/types";

/** "Yana ko‘rsatish": keyingi sahifa. Parametrlar qayta tekshiriladi. */
export async function loadMore(params: Record<string, string>, page: number) {
  const q = parseQuery(params);
  const p = Math.min(Math.max(1, Math.floor(page)), 50);
  const data = await getListings({ ...q, page: p });
  return { results: data.results, hasMore: !!data.next };
}

export async function favoritesByCodes(codes: number[]): Promise<ListingCard[]> {
  const clean = [...new Set(codes.filter((c) => Number.isInteger(c) && c > 0))].slice(0, 50);
  return getByCodes(clean);
}

export type ReportState = { ok: boolean; message: string };

const REASONS = new Set(["sold", "wrong_price", "wrong_info", "fraud", "other"]);

/** Shikoyat → backend. Haqiqiy IP kalit bilan uzatiladi: limit va takrorni tekshirish IP bo‘yicha ishlaydi. */
export async function reportListing(_prev: ReportState, fd: FormData): Promise<ReportState> {
  const code = Number(fd.get("code"));
  const reason = String(fd.get("reason") ?? "");
  const note = String(fd.get("note") ?? "").trim().slice(0, 500);
  if (!Number.isInteger(code) || !REASONS.has(reason)) return { ok: false, message: "Sababni tanlang." };
  if (usingMock) return { ok: true, message: "Rahmat! Shikoyatingiz moderatorga yuborildi." };
  try {
    const res = await fetch(`${process.env.API_BASE!.replace(/\/+$/, "")}/listings/${code}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Leads-Key": process.env.LEADS_API_KEY ?? "",
        "X-Client-IP": await clientIp(),
      },
      body: JSON.stringify({ reason, note }),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 429) return { ok: false, message: "Juda ko‘p urinish. Birozdan so‘ng qayta yuboring." };
    if (res.status === 404) return { ok: false, message: "Bu e’lon endi mavjud emas." };
    if (!res.ok) return { ok: false, message: "Yuborib bo‘lmadi. Qayta urinib ko‘ring." };
  } catch {
    return { ok: false, message: "Ulanishda xatolik. Qayta urinib ko‘ring." };
  }
  return { ok: true, message: "Rahmat! Shikoyatingiz moderatorga yuborildi." };
}

async function clientIp() {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
}

const EVENTS = new Set(["view", "phone", "telegram", "share"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Statistika: ko‘rish, qo‘ng‘iroq, Telegram, ulashish. Backend bir qurilmadan kuniga bir marta hisoblaydi. */
export async function trackEvent(code: number, type: string, deviceId: string) {
  if (usingMock || !Number.isInteger(code) || !EVENTS.has(type) || !UUID.test(deviceId)) return;
  try {
    await fetch(`${process.env.API_BASE!.replace(/\/+$/, "")}/listings/${code}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-Id": deviceId,
        "X-Leads-Key": process.env.LEADS_API_KEY ?? "",
        "X-Client-IP": await clientIp(),
      },
      body: JSON.stringify({ type }),
      signal: AbortSignal.timeout(5_000),
    });
  } catch {
    // statistika foydalanuvchiga xalaqit bermasligi kerak
  }
}
