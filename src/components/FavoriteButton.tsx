"use client";

import { toggleFavorite, useFavorites } from "@/lib/favorites";

export function HeartIcon({ filled = false, className = "size-[18px]" }: { filled?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "#dc2626" : "none"} stroke={filled ? "#dc2626" : "currentColor"} strokeWidth="2" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

export function FavoriteButton({ code, className = "" }: { code: number; className?: string }) {
  const on = useFavorites().includes(code);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(code);
      }}
      aria-pressed={on}
      aria-label={on ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo‘shish"}
      className={`grid place-items-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:scale-105 ${className}`}
    >
      <HeartIcon filled={on} />
    </button>
  );
}

export function FavoritesCount() {
  const n = useFavorites().length;
  if (!n) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 rounded-full bg-red-600 px-1.5 text-[11px] leading-[17px] font-bold text-white">{n}</span>
  );
}
