"use server";

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

/** Shikoyat. Backendda endpoint qo‘shilguncha javob 404 bo‘lsa ham foydalanuvchiga xato ko‘rsatilmaydi. */
export async function reportListing(_prev: ReportState, fd: FormData): Promise<ReportState> {
  const code = Number(fd.get("code"));
  const reason = String(fd.get("reason") ?? "");
  const note = String(fd.get("note") ?? "").trim().slice(0, 500);
  if (!Number.isInteger(code) || !REASONS.has(reason)) return { ok: false, message: "Sababni tanlang." };
  if (usingMock) return { ok: true, message: "Rahmat! Shikoyatingiz moderatorga yuborildi." };
  try {
    const res = await fetch(`${process.env.API_BASE!.replace(/\/+$/, "")}/listings/${code}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, note }),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 429) return { ok: false, message: "Juda ko‘p urinish. Birozdan so‘ng qayta yuboring." };
    if (!res.ok && res.status !== 404) return { ok: false, message: "Yuborib bo‘lmadi. Qayta urinib ko‘ring." };
  } catch {
    return { ok: false, message: "Ulanishda xatolik. Qayta urinib ko‘ring." };
  }
  return { ok: true, message: "Rahmat! Shikoyatingiz moderatorga yuborildi." };
}
