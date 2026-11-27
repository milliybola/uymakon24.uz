import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginPanel } from "@/components/account/LoginPanel";
import { MyListings } from "@/components/account/MyListings";
import { getMe, getMyListings } from "@/lib/session";

export const metadata: Metadata = { title: "Mening e’lonlarim", robots: { index: false } };

export default function MyListingsPage({ searchParams }: PageProps<"/mening-elonlarim">) {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-10">
      <Suspense fallback={<div className="mx-auto h-96 max-w-3xl animate-pulse rounded-3xl bg-slate-100" />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Content({ searchParams }: { searchParams: PageProps<"/mening-elonlarim">["searchParams"] }) {
  const [me, items, sp] = await Promise.all([getMe(), getMyListings(), searchParams]);
  if (!me || !items) return <LoginPanel title="E’lonlaringizni ko‘rish uchun kiring" text="Telegram orqali kiring: e’lonlaringiz, ularning holati va statistikasi shu yerda." />;
  return <MyListings items={items} name={`${me.name} · ${me.phone}`} justSubmitted={sp.yuborildi === "1"} />;
}
