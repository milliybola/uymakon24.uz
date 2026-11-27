"use client";

import dynamic from "next/dynamic";

/** Leaflet faqat brauzerda ishlaydi, shuning uchun serverda render qilinmaydi. */
export const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-[#eef2e8]" />,
});
export type { Pin } from "./LeafletMap";
