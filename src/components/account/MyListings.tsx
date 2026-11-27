"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { deleteListing, logout, setListingStatus } from "@/app/account-actions";
import { Photo } from "@/components/Photo";
import { priceText } from "@/lib/format";
import type { MyListing } from "@/lib/types";

const STATUS: Record<MyListing["status"], [string, string]> = {
  draft: ["Qoralama", "bg-slate-100 text-slate-600"],
  pending: ["🕓 Tekshiruvda", "bg-amber-100 text-amber-900"],
  active: ["✓ Faol", "bg-green-100 text-green-800"],
  rejected: ["✕ Rad etilgan", "bg-red-100 text-red-800"],
  hidden: ["⏸ Yashirilgan", "bg-slate-100 text-slate-600"],
  sold: ["Sotilgan", "bg-slate-800 text-white"],
  rented: ["Ijaraga berilgan", "bg-slate-800 text-white"],
};

export function MyListings({ items, name, justSubmitted }: { items: MyListing[]; name: string; justSubmitted: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const act = (fn: () => Promise<{ ok: boolean; error?: string }>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    start(async () => {
      const r = await fn();
      if (!r.ok) window.alert(r.error ?? "Bajarib bo‘lmadi. Qayta urinib ko‘ring.");
      router.refresh();
    });
  };
  const btn = "rounded-xl border-2 border-slate-200 bg-white px-3 py-1.5 text-sm font-bold hover:border-slate-300 disabled:opacity-50";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Mening e’lonlarim</h1>
          <p className="text-sm text-slate-500">{name}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/elon-berish" className="rounded-xl bg-brand px-4 py-2.5 font-bold text-white">
            + Yangi e’lon
          </Link>
          <form action={logout}>
            <button className="rounded-xl border-2 border-slate-200 px-4 py-2 font-bold text-slate-600">Chiqish</button>
          </form>
        </div>
      </div>

      {justSubmitted && (
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900">
          <b>🕓 E’lon tekshiruvga yuborildi.</b> Moderator ko‘rib chiqadi: natija Telegram’da keladi.
        </div>
      )}

      <div className="mt-5 grid gap-3">
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-500">Hali e’lon yo‘q.</p>
            <Link href="/elon-berish" className="mt-3 inline-block rounded-xl bg-brand px-5 py-2.5 font-bold text-white">
              Birinchi e’lonni berish
            </Link>
          </div>
        )}
        {items.map((l) => {
          const [label, cls] = STATUS[l.status];
          return (
            <div key={l.code} className="rounded-2xl border border-slate-200 bg-white p-3.5">
              <div className="flex gap-3">
                <div className="h-20 w-26 shrink-0 overflow-hidden rounded-xl">
                  <Photo src={l.images[0]?.thumb ?? l.thumb} alt="" seed={l.code} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold ${cls}`}>{label}</span>
                    <span className="text-xs text-slate-400">#{l.code}</span>
                  </div>
                  <b className="mt-1 block">{l.price ? priceText(l as never) : "Narx kiritilmagan"}</b>
                  <div className="line-clamp-1 text-sm text-slate-600">{l.title}</div>
                  {l.status === "active" && (
                    <div className="text-xs text-slate-500">
                      👁 {l.views_count} · 📞 {l.phone_clicks}
                    </div>
                  )}
                </div>
              </div>
              {l.status === "rejected" && l.reject_reason && <p className="mt-2.5 rounded-xl bg-red-50 p-2.5 text-sm text-red-800">Sabab: {l.reject_reason}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {l.status === "active" && (
                  <Link href={`/e/${l.code}`} className={btn}>
                    Ko‘rish
                  </Link>
                )}
                {!["sold", "rented"].includes(l.status) && (
                  <Link href={`/elon-berish/${l.code}`} className={btn}>
                    {l.status === "draft" ? "Davom ettirish" : l.status === "rejected" ? "✏ Tuzatib, qayta yuborish" : "✏ Tahrirlash"}
                  </Link>
                )}
                {l.status === "active" && (
                  <>
                    <button disabled={pending} className={btn} onClick={() => act(() => setListingStatus(l.code, l.deal_type === "sale" ? "sold" : "rented"), "E’lon yopilsinmi?")}>
                      ✓ {l.deal_type === "sale" ? "Sotildi" : "Ijaraga berildi"}
                    </button>
                    <button disabled={pending} className={btn} onClick={() => act(() => setListingStatus(l.code, "hidden"))}>
                      ⏸ Yashirish
                    </button>
                  </>
                )}
                {l.status === "hidden" && (
                  <button disabled={pending} className={btn} onClick={() => act(() => setListingStatus(l.code, "restore"))}>
                    ▶ Qayta ochish
                  </button>
                )}
                <button disabled={pending} className={btn + " text-red-600"} onClick={() => act(() => deleteListing(l.code), "E’lon o‘chirilsinmi? Buni qaytarib bo‘lmaydi.")}>
                  🗑 O‘chirish
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
