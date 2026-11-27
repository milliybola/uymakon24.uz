"use client";

import { useActionState, useRef, useState } from "react";

import { reportListing, type ReportState } from "@/app/listing-actions";
import { formatPhone } from "@/lib/site";

const tgUrl = (u: string) => `https://t.me/${u.replace(/^@/, "")}`;

/** Raqam boshida yashirin: botlar o‘qiy olmaydi, bosilganda ochiladi. */
export function ContactButtons({ phone, telegram, compact = false }: { phone: string; telegram: string; compact?: boolean }) {
  const [shown, setShown] = useState(false);
  const pretty = formatPhone(phone);
  const masked = pretty.replace(/\d{2} \d{2}$/, "•• ••");
  const tel = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const btn = "flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold transition";

  return (
    <div className={compact ? "flex gap-2" : "mt-3 grid gap-2.5"}>
      {phone &&
        (shown || compact ? (
          <a href={tel} className={`${btn} flex-1 bg-brand text-white hover:bg-brand-700`}>
            📞 {compact ? "Qo‘ng‘iroq" : pretty}
          </a>
        ) : (
          <button onClick={() => setShown(true)} className={`${btn} bg-brand text-white hover:bg-brand-700`}>
            📞 {masked} · Ko‘rsatish
          </button>
        ))}
      {telegram && (
        <a href={tgUrl(telegram)} target="_blank" rel="noopener" className={`${btn} flex-1 bg-[#229ed9] text-white hover:brightness-95`}>
          ✈ {compact ? "Telegram" : "Telegram orqali yozish"}
        </a>
      )}
    </div>
  );
}

export function ShareButton({ url, title, className = "" }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      aria-label="Ulashish"
      className={className}
      onClick={async () => {
        const full = new URL(url, location.origin).toString();
        if (navigator.share) {
          try {
            await navigator.share({ title, url: full });
          } catch {}
          return;
        }
        await navigator.clipboard?.writeText(full);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
    >
      {copied ? (
        <span className="text-xs font-bold">✓</span>
      ) : (
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
        </svg>
      )}
    </button>
  );
}

const REASONS = [
  ["sold", "Sotilgan yoki ijaraga berilgan"],
  ["wrong_price", "Narx noto‘g‘ri"],
  ["wrong_info", "Ma’lumot yoki rasmlar noto‘g‘ri"],
  ["fraud", "Firibgarlikka o‘xshaydi"],
  ["other", "Boshqa sabab"],
] as const;

export function ReportBox({ code }: { code: number }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState<ReportState, FormData>(reportListing, { ok: false, message: "" });
  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">⚠</span>
      <div className="flex-1">
        <b>E’lon bilan muammo bormi?</b>
        <div className="text-sm text-slate-500">Sotilgan, narx noto‘g‘ri yoki firibgarlik: xabar bering</div>
      </div>
      <button onClick={() => dlg.current?.showModal()} className="rounded-xl border-2 border-slate-200 px-4 py-2 font-bold text-red-600">
        Shikoyat
      </button>
      <dialog ref={dlg} className="m-auto w-[min(92vw,420px)] rounded-2xl p-0 backdrop:bg-black/50">
        {state.ok ? (
          <div className="p-6 text-center">
            <div className="text-4xl">✅</div>
            <p className="mt-3 font-semibold">{state.message}</p>
            <button onClick={() => dlg.current?.close()} className="mt-4 rounded-xl bg-brand px-5 py-2.5 font-bold text-white">
              Yopish
            </button>
          </div>
        ) : (
          <form action={action} className="grid gap-3 p-5">
            <h3 className="text-lg font-bold">Shikoyat qilish</h3>
            <input type="hidden" name="code" value={code} />
            {REASONS.map(([v, t]) => (
              <label key={v} className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 px-3 py-2.5 has-checked:border-brand has-checked:bg-brand-50">
                <input type="radio" name="reason" value={v} required className="accent-brand" />
                {t}
              </label>
            ))}
            <textarea name="note" rows={3} maxLength={500} placeholder="Izoh (ixtiyoriy)" className="input" />
            {state.message && <p className="text-sm text-red-600">{state.message}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => dlg.current?.close()} className="rounded-xl border-2 border-slate-200 px-4 py-2 font-bold">
                Bekor qilish
              </button>
              <button disabled={pending} className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white disabled:opacity-60">
                {pending ? "Yuborilmoqda…" : "Yuborish"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}
