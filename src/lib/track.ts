"use client";

import { trackEvent } from "@/app/listing-actions";

const KEY = "uymakon24:device";

/** Qurilma uchun tasodifiy ID (statistikada bir qurilma kuniga bir marta hisoblanadi). */
function deviceId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function track(code: number, type: "view" | "phone" | "telegram" | "share") {
  const id = deviceId();
  if (id) void trackEvent(code, type, id);
}
