import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { BuyerCard, EmptyState } from "@/components/Sections";
import { getBuyers } from "@/lib/api";
import { requestTime } from "@/lib/now";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Xaridorlar izlayapti",
  description: "G‘allaorolda kim qanday uy, yer yoki do‘kon izlayapti: byudjet va talablar. Mulkingiz mos kelsa, e’lon bering.",
  alternates: { canonical: "/xaridorlar" },
};

export default function BuyersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">🙋 Xaridorlar izlayapti</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Bu yerda uy, yer yoki do‘kon izlayotganlarning so‘rovlari. Mulkingiz mos kelsa, e’lon bering: biz xaridorni siz bilan bog‘laymiz.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Suspense fallback={<div className="col-span-full h-32 animate-pulse rounded-2xl bg-slate-100" />}>
          <Buyers />
        </Suspense>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/elon-berish" className="rounded-xl bg-brand px-5 py-3 font-bold text-white">
          Mulkim mos keladi: e’lon berish
        </Link>
        <Link href="/ariza" className="rounded-xl border-2 border-slate-200 bg-white px-5 py-3 font-bold">
          Men ham izlayapman
        </Link>
      </div>
    </div>
  );
}

async function Buyers() {
  await connection();
  const [buyers, now] = [await getBuyers(), requestTime()];
  if (!buyers.length) {
    return <EmptyState title="Hozircha so‘rovlar yo‘q" text="Birinchi bo‘lib nima izlayotganingizni yozing: mos e’lon chiqsa, xabar beramiz." />;
  }
  return buyers.map((b) => <BuyerCard key={b.id} b={b} now={now} />);
}
