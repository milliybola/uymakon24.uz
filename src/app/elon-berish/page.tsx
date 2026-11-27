import type { Metadata } from "next";
import { Suspense } from "react";

import { ListingForm } from "@/components/account/ListingForm";
import { LoginPanel } from "@/components/account/LoginPanel";
import { getMahallas, getMe } from "@/lib/session";

export const metadata: Metadata = {
  title: "E’lon berish",
  description: "G‘allaorolda uy, yer yoki do‘koningizni bepul e’lon qiling: Telegram orqali kiring, moderator tekshiruvidan so‘ng saytda chiqadi.",
  alternates: { canonical: "/elon-berish" },
};

export default function NewListingPage() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-10">
      <Suspense fallback={<div className="mx-auto h-96 max-w-2xl animate-pulse rounded-3xl bg-slate-100" />}>
        <Content />
      </Suspense>
    </div>
  );
}

async function Content() {
  const me = await getMe();
  if (!me) return <LoginPanel />;
  return <ListingForm mahallas={await getMahallas()} phone={me.phone} />;
}
