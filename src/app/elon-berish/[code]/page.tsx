import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ListingForm } from "@/components/account/ListingForm";
import { LoginPanel } from "@/components/account/LoginPanel";
import { getMahallas, getMe, getMyListing } from "@/lib/session";

export const metadata: Metadata = { title: "E’lonni tahrirlash", robots: { index: false } };

export default function EditListingPage({ params }: PageProps<"/elon-berish/[code]">) {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-10">
      <Suspense fallback={<div className="mx-auto h-96 max-w-2xl animate-pulse rounded-3xl bg-slate-100" />}>
        <Content params={params} />
      </Suspense>
    </div>
  );
}

async function Content({ params }: { params: PageProps<"/elon-berish/[code]">["params"] }) {
  const { code } = await params;
  if (!/^\d{1,9}$/.test(code)) notFound();
  const [me, item] = await Promise.all([getMe(), getMyListing(Number(code))]);
  if (!me || item === "auth") return <LoginPanel />;
  if (!item) notFound();
  if (item.status === "sold" || item.status === "rented") notFound();
  return <ListingForm initial={item} mahallas={await getMahallas()} phone={me.phone} />;
}
