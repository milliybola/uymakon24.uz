"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CATEGORIES, DEALS } from "@/lib/format";
import { toHref, withDeal } from "@/lib/query";
import type { ListingQuery } from "@/lib/types";

const ROOMS = ["1", "2", "3", "4+"];

/** Bosh sahifadagi qidiruv: tablar, qidiruv qatori, kategoriya va filtrlar. Holat URLda saqlanadi. */
export function SearchPanel({ query }: { query: ListingQuery }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const go = (q: ListingQuery) => router.push(toHref(q), { scroll: false });
  const chip = "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition";
  const on = "border-white bg-white text-brand";
  const off = "border-white/20 bg-white/10 text-white hover:bg-white/20";
  const rooms = new Set(query.rooms?.split(",") ?? []);
  const filters = (query.rooms ? 1 : 0) + (query.price_min || query.price_max ? 1 : 0);

  return (
    <div className="bg-gradient-to-br from-brand to-brand-900 py-5 text-white sm:py-7">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-xl font-extrabold tracking-tight sm:text-3xl">G‘allaorolda uy, yer va do‘kon</h1>
        <p className="mt-1 hidden text-brand-100 sm:block">Sotuv, ijara va kunlik ijara: barcha e’lonlar bitta joyda</p>

        <div className="mt-4 flex rounded-2xl bg-white/10 p-1 sm:inline-flex">
          {DEALS.map((d) => (
            <Link
              key={d.key}
              href={toHref(withDeal({ deal: query.deal, category: query.category }, d.key))}
              scroll={false}
              className={`flex-1 rounded-xl px-5 py-2 text-center font-bold transition sm:flex-none ${query.deal === d.key ? "bg-white text-brand" : "text-brand-100 hover:text-white"}`}
            >
              {d.name}
            </Link>
          ))}
        </div>

        <form
          className="mt-3 flex gap-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            const v = String(new FormData(e.currentTarget).get("q") ?? "").trim();
            go({ ...query, q: v || undefined });
          }}
        >
          <label className="flex h-12 flex-1 items-center gap-2.5 rounded-2xl bg-white px-4 text-slate-500 sm:h-13">
            <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              name="q"
              defaultValue={query.q}
              key={query.q}
              placeholder="Mahalla, ko‘cha yoki e’lon raqami"
              className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
              enterKeyHint="search"
            />
          </label>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Filtrlar"
            className="relative grid size-12 place-items-center rounded-2xl bg-white text-brand sm:size-13"
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
              <circle cx="16" cy="6" r="2" />
              <circle cx="10" cy="12" r="2" />
              <circle cx="18" cy="18" r="2" />
            </svg>
            {filters > 0 && <span className="absolute -top-1 -right-1 rounded-full bg-accent px-1.5 text-xs font-bold text-amber-950">{filters}</span>}
          </button>
        </form>

        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <button className={`${chip} ${!query.category ? on : off}`} onClick={() => go({ ...query, category: undefined })}>
            Barchasi
          </button>
          {CATEGORIES.filter((c) => query.deal === "sale" || c.slug !== "yer").map((c) => (
            <button key={c.slug} className={`${chip} ${query.category === c.slug ? on : off}`} onClick={() => go({ ...query, category: query.category === c.slug ? undefined : c.slug })}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        {open && (
          <form
            className="mt-3 grid gap-4 rounded-2xl bg-white p-4 text-slate-900 sm:grid-cols-[auto_1fr_auto] sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const n = (k: string) => {
                const v = Number(String(fd.get(k) ?? "").replace(/\D/g, ""));
                return v > 0 ? v * 1_000_000 : undefined;
              };
              const r = ROOMS.filter((x) => fd.get(`r${x}`));
              go({ ...query, rooms: r.length ? r.join(",") : undefined, price_min: n("min"), price_max: n("max") });
              setOpen(false);
            }}
          >
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-slate-600">Xonalar</legend>
              <div className="flex gap-2">
                {ROOMS.map((r) => (
                  <label key={r} className="cursor-pointer">
                    <input type="checkbox" name={`r${r}`} defaultChecked={rooms.has(r)} className="peer sr-only" />
                    <span className="grid h-10 min-w-11 place-items-center rounded-xl border-2 border-slate-200 px-3 font-bold peer-checked:border-brand peer-checked:bg-brand-50 peer-checked:text-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                      {r}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-slate-600">Narx, mln so‘m</legend>
              <div className="flex items-center gap-2">
                <input name="min" inputMode="numeric" placeholder="dan" defaultValue={query.price_min ? query.price_min / 1e6 : ""} className="input py-2" />
                <span className="text-slate-400">—</span>
                <input name="max" inputMode="numeric" placeholder="gacha" defaultValue={query.price_max ? query.price_max / 1e6 : ""} className="input py-2" />
              </div>
            </fieldset>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-xl border-2 border-slate-200 px-4 py-2.5 font-bold"
                onClick={() => {
                  go({ ...query, rooms: undefined, price_min: undefined, price_max: undefined });
                  setOpen(false);
                }}
              >
                Tozalash
              </button>
              <button className="rounded-xl bg-brand px-5 py-2.5 font-bold text-white hover:bg-brand-700">Ko‘rsatish</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function SortSelect({ query }: { query: ListingQuery }) {
  const router = useRouter();
  return (
    <select
      aria-label="Saralash"
      value={query.sort ?? "new"}
      onChange={(e) => router.push(toHref({ ...query, sort: e.target.value === "new" ? undefined : (e.target.value as ListingQuery["sort"]) }), { scroll: false })}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
    >
      <option value="new">Eng yangilari</option>
      <option value="cheap">Avval arzonlari</option>
      <option value="expensive">Avval qimmatlari</option>
    </select>
  );
}
