"use server";

import { headers } from "next/headers";

export type LeadState = {
  ok: boolean;
  message: string;
  errors?: Partial<Record<"name" | "phone" | "intent" | "category" | "location" | "note", string>>;
};

const INTENTS = new Set(["sell", "rent_out", "buy", "rent"]);
const CATEGORIES = new Set(["", "hovli", "kvartira", "yer", "tijorat"]);

const str = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);

export async function submitLead(_prev: LeadState, fd: FormData): Promise<LeadState> {
  // Bot tuzog‘i: odam bu maydonni ko‘rmaydi va to‘ldirmaydi
  if (str(fd, "website", 100)) return { ok: true, message: "Rahmat!" };

  const data = {
    name: str(fd, "name", 80),
    phone: str(fd, "phone", 20).replace(/\D/g, ""),
    intent: str(fd, "intent", 10),
    category: str(fd, "category", 20),
    location: str(fd, "location", 120),
    note: str(fd, "note", 1000),
    source: "landing",
  };

  const errors: LeadState["errors"] = {};
  if (data.name.length < 2) errors.name = "Ismingizni kiriting.";
  if (!/^(998)?\d{9}$/.test(data.phone)) errors.phone = "Raqamni to‘liq kiriting: 90 123 45 67";
  if (!INTENTS.has(data.intent)) errors.intent = "Maqsadni tanlang.";
  if (!CATEGORIES.has(data.category)) errors.category = "Kategoriyani tanlang.";
  if (Object.keys(errors).length) return { ok: false, message: "Maydonlarni tekshiring.", errors };

  const api = process.env.API_BASE;
  if (!api) {
    console.error("API_BASE sozlanmagan");
    return { ok: false, message: "Hozir arizani qabul qila olmadik. Birozdan so‘ng urinib ko‘ring." };
  }

  const h = await headers();
  const ip = h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "";

  try {
    const res = await fetch(`${api.replace(/\/$/, "")}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Leads-Key": process.env.LEADS_API_KEY || "",
        ...(ip ? { "X-Client-IP": ip } : {}),
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 429) {
      return { ok: false, message: "Juda ko‘p urinish. Birozdan so‘ng qayta yuboring." };
    }
    if (res.status === 400) {
      const body = (await res.json().catch(() => ({}))) as Record<string, string[]>;
      const fieldErrors: LeadState["errors"] = {};
      for (const [k, v] of Object.entries(body)) {
        if (k in data) fieldErrors[k as keyof NonNullable<LeadState["errors"]>] = Array.isArray(v) ? v[0] : String(v);
      }
      return { ok: false, message: "Maydonlarni tekshiring.", errors: fieldErrors };
    }
    if (!res.ok) throw new Error(`API ${res.status}`);
  } catch (e) {
    console.error("Lead yuborilmadi:", e);
    return { ok: false, message: "Ulanishda xatolik. Birozdan so‘ng qayta urinib ko‘ring." };
  }

  return { ok: true, message: "Arizangiz qabul qilindi! Tez orada siz bilan bog‘lanamiz." };
}
