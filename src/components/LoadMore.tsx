"use client";

import { useState, useTransition } from "react";

import { loadMore } from "@/app/listing-actions";
import type { ListingCard as L } from "@/lib/types";

import { ListingCard } from "./ListingCard";

export function LoadMore({ params, now }: { params: Record<string, string>; now: number }) {
  const [items, setItems] = useState<L[]>([]);
  const [page, setPage] = useState(2);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [pending, start] = useTransition();

  return (
    <>
      {items.map((l) => (
        <ListingCard key={l.code} l={l} now={now} />
      ))}
      {!done && (
        <div className="col-span-full mt-4 flex flex-col items-center gap-2">
          {error && <p className="text-sm text-red-600">Yuklab bo‘lmadi. Qayta urinib ko‘ring.</p>}
          <button
            disabled={pending}
            onClick={() =>
              start(async () => {
                try {
                  const r = await loadMore(params, page);
                  setItems((x) => [...x, ...r.results]);
                  setPage((p) => p + 1);
                  setDone(!r.hasMore);
                  setError(false);
                } catch {
                  setError(true);
                }
              })
            }
            className="rounded-xl border-2 border-slate-200 bg-white px-6 py-2.5 font-bold hover:border-brand hover:text-brand disabled:opacity-60"
          >
            {pending ? "Yuklanmoqda…" : "Yana ko‘rsatish"}
          </button>
        </div>
      )}
    </>
  );
}
