import Link from "next/link";

import { ago, categoryName, priceText } from "@/lib/format";
import type { Buyer, ListingCard } from "@/lib/types";

import { Badge } from "./ListingCard";
import { Photo } from "./Photo";

export function QuickLinks() {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-[2fr_1fr]">
      <Link href="/xarita" className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-brand-50 p-3.5 font-bold">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-xl">📍</span>
        <span>
          Xaritada ko‘rish
          <small className="block text-[13px] font-medium text-slate-500">Narxlar xaritada, yaqiningizdagilar</small>
        </span>
        <span
          aria-hidden="true"
          className="absolute -top-3 -right-3 h-24 w-36 rounded-3xl opacity-70"
          style={{
            background:
              "repeating-linear-gradient(35deg,transparent 0 18px,#a7f3d0 18px 21px),repeating-linear-gradient(-55deg,transparent 0 26px,#bae6fd 26px 29px)",
          }}
        />
      </Link>
      <Link href="/xaridorlar" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 font-bold">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-xl">🙋</span>
        <span>
          Xaridorlar
          <small className="block text-[13px] font-medium text-slate-500">Kim nima izlayapti</small>
        </span>
      </Link>
    </div>
  );
}

export function VipCarousel({ items }: { items: ListingCard[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-7">
      <h2 className="mb-3 text-xl font-extrabold tracking-tight">⭐ VIP e’lonlar</h2>
      <div className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:gap-4 sm:px-0">
        {items.map((l, i) => (
          <Link
            key={l.code}
            href={`/e/${l.code}`}
            className="relative aspect-[16/10] w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl text-white sm:w-[calc((100%-2rem)/3)]"
          >
            <Photo src={l.thumb} alt={l.title} seed={l.code} eager={i < 2} />
            <span className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black/70" />
            <span className="absolute top-2.5 left-2.5">
              <Badge kind="vip" />
            </span>
            <span className="absolute inset-x-4 bottom-3.5">
              <span className="block text-xl font-extrabold tracking-tight sm:text-2xl">{priceText(l)}</span>
              <span className="line-clamp-1 text-sm">{l.title}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

const INTENT = {
  buy: { label: "Sotib oladi", cls: "bg-brand-50 text-brand" },
  rent: { label: "Ijaraga oladi", cls: "bg-blue-50 text-rent" },
};

export function BuyerCard({ b, now }: { b: Buyer; now: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
      <div className="flex justify-between text-xs text-slate-500">
        <span className={`rounded-md px-2 py-0.5 font-bold ${INTENT[b.intent].cls}`}>{INTENT[b.intent].label}</span>
        <span>{ago(b.created_at, now)}</span>
      </div>
      <div className="mt-2 text-base font-extrabold">{b.budget}</div>
      <div className="mt-0.5 text-slate-600">
        {b.category ? `${categoryName(b.category)} · ` : ""}
        {b.note}
      </div>
    </div>
  );
}

export function SellCta() {
  return (
    <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl bg-gradient-to-r from-brand-900 to-brand p-6 text-white sm:flex-row sm:items-center sm:p-7">
      <div className="flex-1">
        <h2 className="text-xl font-extrabold tracking-tight">Mulkingizni sotmoqchimisiz yoki ijaraga bermoqchimisiz?</h2>
        <p className="mt-1 text-sm text-brand-100">Ariza qoldiring: e’loningizni tez va to‘g‘ri joylashtirishga yordam beramiz.</p>
      </div>
      <Link href="/elon-berish" className="rounded-xl bg-white px-5 py-3 font-bold text-brand">
        E’lon berish
      </Link>
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="text-4xl">🔍</div>
      <h3 className="mt-3 text-lg font-bold">{title}</h3>
      <p className="mt-1 text-slate-500">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
