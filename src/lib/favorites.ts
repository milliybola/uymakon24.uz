"use client";

import { useSyncExternalStore } from "react";

/** Sevimlilar akkauntsiz, brauzerda (localStorage) saqlanadi. */
const KEY = "uymakon24:fav";
const EMPTY: number[] = [];
let cache: number[] | null = null;
const listeners = new Set<() => void>();

function read(): number[] {
  if (cache) return cache;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    cache = Array.isArray(v) ? v.filter((x) => Number.isInteger(x)).slice(0, 100) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function toggleFavorite(code: number) {
  const cur = read();
  cache = cur.includes(code) ? cur.filter((c) => c !== code) : [code, ...cur].slice(0, 100);
  localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach((l) => l());
}

export function useFavorites() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
