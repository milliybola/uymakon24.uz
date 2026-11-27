import Link from "next/link";

import { facts, isNew, money, priceText } from "@/lib/format";
import type { ListingCard as L } from "@/lib/types";

import { FavoriteButton } from "./FavoriteButton";
import { Photo } from "./Photo";

export function Badge({ kind }: { kind: "top" | "new" | "vip" | "drop" | "sold" }) {
  const cls = {
    top: "bg-accent text-amber-950",
    new: "bg-white/95 text-slate-900",
    vip: "bg-slate-900 text-amber-200",
    drop: "bg-green-100 text-green-800",
    sold: "bg-slate-900/80 text-white",
  }[kind];
  const text = { top: "TOP", new: "Yangi", vip: "VIP", drop: "↓ Narx tushdi", sold: "Sotilgan" }[kind];
  return <span className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold tracking-wide ${cls}`}>{text}</span>;
}

export function ListingCard({ l, now, eager = false }: { l: L; now: number; eager?: boolean }) {
  const dropped = l.old_price != null && l.old_price > l.price;
  return (
    <Link
      href={`/e/${l.code}`}
      className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Photo src={l.thumb} alt={l.title} seed={l.code} eager={eager} className="transition duration-300 group-hover:scale-[1.03]" />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {l.status !== "active" && <Badge kind="sold" />}
          {l.is_featured && <Badge kind="top" />}
          {isNew(l.published_at, now) && <Badge kind="new" />}
          {dropped && <Badge kind="drop" />}
        </div>
        <FavoriteButton code={l.code} className="absolute top-2 right-2 size-8" />
        {l.images_count > 0 && (
          <span className="absolute right-2 bottom-2 rounded-md bg-black/45 px-1.5 py-0.5 text-[11px] text-white">📷 {l.images_count}</span>
        )}
      </div>
      <div className="p-3 sm:p-3.5">
        <div className="flex flex-wrap items-baseline gap-x-1.5 text-[15px] font-extrabold tracking-tight sm:text-lg">
          {priceText(l)}
          {dropped && <span className="text-xs font-medium text-slate-400 line-through">{money(l.old_price!, l.currency)}</span>}
        </div>
        <div className="mt-0.5 line-clamp-1 text-[13px] text-slate-600 sm:text-sm">{l.title}</div>
        <div className="mt-1.5 line-clamp-1 text-xs text-slate-500 sm:text-[13px]">{facts(l).join(" · ") || " "}</div>
        <div className="mt-2.5 hidden border-t border-dashed border-slate-200 pt-2.5 text-xs text-slate-500 sm:block">
          <span className="block truncate">📍 {l.mahalla ?? "G‘allaorol"}</span>
        </div>
      </div>
    </Link>
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-slate-100" />
      <div className="space-y-2 p-3.5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

export const GRID = "grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4";
