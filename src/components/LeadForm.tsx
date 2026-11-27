"use client";

import { useActionState, useState } from "react";

import { submitLead, type LeadState } from "@/app/actions";

const INTENTS = [
  { v: "sell", t: "Sotmoqchiman" },
  { v: "rent_out", t: "Ijaraga bermoqchiman" },
  { v: "buy", t: "Sotib olmoqchiman" },
  { v: "rent", t: "Ijaraga olmoqchiman" },
];
const CATEGORIES = [
  { v: "hovli", t: "Hovli / uy" },
  { v: "kvartira", t: "Kvartira" },
  { v: "yer", t: "Yer uchastkasi" },
  { v: "tijorat", t: "Do‘kon / tijorat" },
];

/** 9 ta raqamni "90 123 45 67" ko‘rinishiga keltiradi */
function maskPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("998") && d.length > 9) d = d.slice(3);
  d = d.slice(0, 9);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");
}

const initial: LeadState = { ok: false, message: "" };

export function LeadForm() {
  const [state, action, pending] = useActionState(submitLead, initial);
  const [intent, setIntent] = useState("sell");
  const [category, setCategory] = useState("hovli");
  const [phone, setPhone] = useState("");
  const err = state.errors ?? {};
  // Yer faqat sotiladi (backenddagi kategoriya qoidasiga mos)
  const cats = intent === "rent_out" || intent === "rent" ? CATEGORIES.filter((c) => c.v !== "yer") : CATEGORIES;

  if (state.ok) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-200 sm:p-12" role="status">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-brand-50 text-3xl">✅</div>
        <h3 className="mt-5 text-2xl font-extrabold">Rahmat!</h3>
        <p className="mt-2 text-slate-600">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8" noValidate>
      <fieldset>
        <legend className="text-sm font-semibold text-slate-700">Maqsadingiz</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {INTENTS.map((i) => (
            <label
              key={i.v}
              className={`cursor-pointer rounded-xl border-2 px-3 py-2.5 text-center text-sm font-semibold transition ${
                intent === i.v ? "border-brand bg-brand-50 text-brand-700" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="intent"
                value={i.v}
                checked={intent === i.v}
                onChange={() => {
                  setIntent(i.v);
                  if ((i.v === "rent" || i.v === "rent_out") && category === "yer") setCategory("hovli");
                }}
                className="sr-only"
              />
              {i.t}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-slate-700">Mulk turi</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {cats.map((c) => (
            <label
              key={c.v}
              className={`cursor-pointer rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${
                category === c.v ? "border-brand bg-brand-50 text-brand-700" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="category"
                value={c.v}
                checked={category === c.v}
                onChange={() => setCategory(c.v)}
                className="sr-only"
              />
              {c.t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Ismingiz" error={err.name}>
          <input name="name" autoComplete="name" maxLength={80} placeholder="Masalan, Akmal" className="input" />
        </Field>
        <Field label="Telefon raqam" error={err.phone}>
          <div className="input flex items-center gap-2 focus-within:border-brand">
            <span className="font-semibold text-slate-500">+998</span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="90 123 45 67"
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </Field>
      </div>

      <Field label="Mahalla yoki manzil (ixtiyoriy)" error={err.location} className="mt-4">
        <input name="location" maxLength={120} placeholder="Masalan, Markaz mahallasi" className="input" />
      </Field>
      <Field label="Qo‘shimcha ma’lumot (ixtiyoriy)" error={err.note} className="mt-4">
        <textarea
          name="note"
          rows={3}
          maxLength={1000}
          placeholder="Xonalar soni, maydoni, taxminiy narxi…"
          className="input resize-none"
        />
      </Field>

      {/* bot tuzog‘i */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state.message && !state.ok && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" aria-live="polite">
          {state.message}
        </p>
      )}

      <button
        disabled={pending}
        className="mt-6 w-full rounded-2xl bg-brand px-6 py-4 text-lg font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Yuborilmoqda…" : "Ariza qoldirish"}
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">
        Yuborish orqali{" "}
        <a href="/maxfiylik" className="underline hover:text-brand">
          maxfiylik siyosati
        </a>
        ga rozilik bildirasiz. Raqamingiz faqat siz bilan bog‘lanish uchun ishlatiladi.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}
