"use client";

/* eslint-disable @next/next/no-img-element -- rasmlar backenddan tayyor o‘lchamlarda keladi */
import { useEffect, useRef, useState } from "react";

import { Photo } from "@/components/Photo";
import type { ListingImage } from "@/lib/types";

/** Telefonda barmoq bilan suriladigan, kompyuterda 1 katta + 2 kichik rasmli galereya; bosilsa to‘liq ekran. */
export function Gallery({ images, title, seed, children }: { images: ListingImage[]; title: string; seed: number; children?: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState<number | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const count = Math.max(images.length, 1);

  useEffect(() => {
    if (full === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(null);
      if (e.key === "ArrowRight") setFull((i) => ((i ?? 0) + 1) % count);
      if (e.key === "ArrowLeft") setFull((i) => ((i ?? 0) - 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [full, count]);

  const pic = (i: number, size: "medium" | "large" = "medium", eager = false) => (
    <Photo src={images[i]?.[size]} alt={`${title}: rasm ${i + 1}`} seed={seed + i} eager={eager} />
  );

  return (
    <div className="relative -mx-4 sm:mx-0">
      {/* telefon: suriladigan lenta */}
      <div
        ref={track}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] md:hidden"
      >
        {Array.from({ length: count }, (_, i) => (
          <button key={i} onClick={() => setFull(i)} className="w-full shrink-0 snap-center" aria-label={`Rasm ${i + 1}ni kattalashtirish`}>
            {pic(i, "medium", i === 0)}
          </button>
        ))}
      </div>
      {/* kompyuter: 1 katta + 2 kichik */}
      <div className="hidden h-[430px] grid-cols-[2fr_1fr] grid-rows-2 gap-2 overflow-hidden rounded-2xl md:grid">
        {Array.from({ length: Math.min(count, 3) }, (_, i) => (
          <button key={i} onClick={() => setFull(i)} className={`overflow-hidden ${i === 0 ? (count === 1 ? "col-span-2 row-span-2" : "row-span-2") : count === 2 ? "row-span-2" : ""}`}>
            {pic(i, i === 0 ? "large" : "medium", i === 0)}
          </button>
        ))}
      </div>
      <button onClick={() => setFull(index)} className="absolute right-3 bottom-3 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-bold shadow md:text-sm">
        🖼 {index + 1} / {count}
        {count > 1 && <span className="hidden md:inline"> · Barcha rasmlar</span>}
      </button>
      {children}

      {full !== null && (
        <div role="dialog" aria-modal="true" aria-label="Rasmlar" className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95" onClick={() => setFull(null)}>
          <div className="h-full max-h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {images[full] ? (
              <img src={images[full].large} alt={`${title}: rasm ${full + 1}`} className="size-full object-contain" />
            ) : (
              pic(full)
            )}
          </div>
          <button onClick={() => setFull(null)} aria-label="Yopish" className="absolute top-3 right-4 text-4xl text-white">
            ×
          </button>
          {count > 1 && (
            <>
              <button aria-label="Oldingi" onClick={(e) => (e.stopPropagation(), setFull((full - 1 + count) % count))} className="absolute left-2 grid size-12 place-items-center rounded-full bg-white/15 text-3xl text-white">
                ‹
              </button>
              <button aria-label="Keyingi" onClick={(e) => (e.stopPropagation(), setFull((full + 1) % count))} className="absolute right-2 grid size-12 place-items-center rounded-full bg-white/15 text-3xl text-white">
                ›
              </button>
            </>
          )}
          <span className="absolute bottom-4 text-sm text-white/80">
            {full + 1} / {count}
          </span>
        </div>
      )}
    </div>
  );
}
