"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { favoritesByCodes } from "@/app/listing-actions";
import { CardSkeleton, GRID, ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/Sections";
import { useFavorites } from "@/lib/favorites";
import type { ListingCard as L } from "@/lib/types";

export function FavoritesList() {
  const codes = useFavorites();
  const [data, setData] = useState<{ items: L[]; now: number } | null>(null);
  const key = codes.join(",");

  useEffect(() => {
    let alive = true;
    favoritesByCodes(key ? key.split(",").map(Number) : [])
      .then((r) => alive && setData({ items: r, now: Date.now() }))
      .catch(() => alive && setData({ items: [], now: Date.now() }));
    return () => {
      alive = false;
    };
  }, [key]);

  // sevimlidan olib tashlangani darhol yo‘qoladi
  const shown = data?.items.filter((l) => codes.includes(l.code)) ?? null;

  return (
    <div className={`mt-6 ${GRID}`}>
      {shown === null ? (
        Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)
      ) : shown.length ? (
        shown.map((l) => <ListingCard key={l.code} l={l} now={data!.now} />)
      ) : (
        <EmptyState
          title="Hali hech narsa saqlanmagan"
          text="E’lonlardagi ♡ belgisini bosing: ular shu yerda to‘planadi."
          action={
            <Link href="/" className="rounded-xl bg-brand px-5 py-2.5 font-bold text-white">
              E’lonlarni ko‘rish
            </Link>
          }
        />
      )}
    </div>
  );
}
