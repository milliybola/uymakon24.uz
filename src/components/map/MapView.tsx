"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Photo } from "@/components/Photo";
import { categoryName, DEALS, dealName, dealOf, facts, pinPrice, priceText } from "@/lib/format";
import type { Deal, ListingCard } from "@/lib/types";

import { LeafletMap, type Pin } from ".";

export function MapView({ items, deal }: { items: ListingCard[]; deal: Deal }) {
  const [active, setActive] = useState<number | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [me, setMe] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState("");

  const pins = useMemo<Pin[]>(
    () => items.map((l) => ({ id: l.code, lat: Number(l.lat), lng: Number(l.lng), label: pinPrice(l), top: l.is_featured })),
    [items],
  );
  const sel = items.find((l) => l.code === active) ?? null;

  const select = (code: number, move = false) => {
    setActive(code);
    const l = items.find((x) => x.code === code);
    if (move && l) setFlyTo([Number(l.lat), Number(l.lng)]);
  };

  const locate = () => {
    setGeoError("");
    if (!navigator.geolocation) return setGeoError("Brauzeringiz joylashuvni aniqlay olmaydi.");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const at: [number, number] = [p.coords.latitude, p.coords.longitude];
        setMe(at);
        setFlyTo(at);
      },
      () => setGeoError("Joylashuvga ruxsat berilmadi."),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  return (
    <div className="grid h-[calc(100dvh-3.5rem)] md:h-[calc(100dvh-4rem)] md:grid-cols-[380px_1fr]">
      <aside className="hidden overflow-y-auto border-r border-slate-200 bg-white md:block">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3.5">
          <b>Xaritada: {items.length} ta e’lon</b>
          <div className="text-[13px] text-slate-500">{dealName(deal)} · e’lonni tanlang yoki xaritadagi narxni bosing</div>
        </div>
        {items.map((l) => (
          <button
            key={l.code}
            onClick={() => select(l.code, true)}
            className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${active === l.code ? "bg-brand-50" : ""}`}
          >
            <span className="h-20 w-26 shrink-0 overflow-hidden rounded-xl">
              <Photo src={l.thumb} alt="" seed={l.code} />
            </span>
            <span className="min-w-0">
              <b className="block">{priceText(l)}</b>
              <span className="line-clamp-1 text-sm text-slate-600">{l.title}</span>
              <span className="line-clamp-1 text-[13px] text-slate-500">{facts(l).join(" · ")}</span>
            </span>
          </button>
        ))}
        {!items.length && <p className="p-6 text-center text-slate-500">Bu bo‘limda xaritada ko‘rsatiladigan e’lon hozircha yo‘q.</p>}
      </aside>

      <div className="relative isolate">
        <LeafletMap pins={pins} activeId={active} onSelect={(id) => select(id)} me={me} flyTo={flyTo} fit />

        <div className="absolute inset-x-3 top-3 z-[500] flex gap-2 md:right-16">
          <div className="flex flex-1 rounded-2xl bg-white p-1 shadow-md md:flex-none">
            {DEALS.map((d) => (
              <Link
                key={d.key}
                href={d.key === "sale" ? "/xarita" : `/xarita?deal=${d.key}`}
                className={`flex-1 rounded-xl px-4 py-2 text-center font-bold md:flex-none ${deal === d.key ? "bg-brand text-white" : "text-slate-700"}`}
              >
                {d.name}
              </Link>
            ))}
          </div>
        </div>

        <button onClick={locate} className="absolute right-3 bottom-24 z-[500] flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-bold shadow-md md:bottom-6">
          ➤ Menga yaqin
        </button>
        {geoError && <p className="absolute right-3 bottom-38 z-[500] rounded-lg bg-white px-3 py-2 text-sm text-red-600 shadow md:bottom-20">{geoError}</p>}

        {sel && (
          <div className="absolute inset-x-3 bottom-20 z-[600] mx-auto flex max-w-md gap-3 rounded-2xl bg-white p-3 shadow-xl md:bottom-6">
            <button onClick={() => setActive(null)} aria-label="Yopish" className="absolute top-1.5 right-2.5 text-xl text-slate-400">
              ×
            </button>
            <Link href={`/e/${sel.code}`} className="h-24 w-28 shrink-0 overflow-hidden rounded-xl">
              <Photo src={sel.thumb} alt={sel.title} seed={sel.code} />
            </Link>
            <div className="min-w-0 pr-4">
              <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand">
                {dealName(dealOf(sel))} · {categoryName(sel.category)}
              </span>
              <Link href={`/e/${sel.code}`} className="mt-1 block font-extrabold">
                {priceText(sel)}
              </Link>
              <div className="line-clamp-1 text-sm text-slate-600">{sel.title}</div>
              <Link href={`/e/${sel.code}`} className="mt-2 inline-block rounded-lg bg-brand px-3 py-1.5 text-sm font-bold text-white">
                Batafsil
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
