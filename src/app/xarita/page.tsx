import type { Metadata } from "next";
import { Suspense } from "react";

import { MapView } from "@/components/map/MapView";
import { getMapListings } from "@/lib/api";
import { parseQuery } from "@/lib/query";

export const metadata: Metadata = {
  title: "Xaritada e’lonlar",
  description: "G‘allaorol bo‘yicha uy, yer va do‘kon e’lonlari xaritada: narxlar, joylashuv va yaqiningizdagi e’lonlar.",
  alternates: { canonical: "/xarita" },
};

export default function MapPage({ searchParams }: PageProps<"/xarita">) {
  return (
    <Suspense fallback={<div className="h-[calc(100dvh-4rem)] animate-pulse bg-[#eef2e8]" />}>
      <MapContent searchParams={searchParams} />
    </Suspense>
  );
}

async function MapContent({ searchParams }: { searchParams: PageProps<"/xarita">["searchParams"] }) {
  const { deal } = parseQuery(await searchParams);
  const items = await getMapListings(deal);
  return <MapView items={items} deal={deal} />;
}
