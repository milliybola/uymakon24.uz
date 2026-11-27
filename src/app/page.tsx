import Link from "next/link";
import { Suspense } from "react";

import { CardSkeleton, GRID, ListingCard } from "@/components/ListingCard";
import { LoadMore } from "@/components/LoadMore";
import { SearchPanel, SortSelect } from "@/components/SearchPanel";
import { BuyerCard, EmptyState, QuickLinks, SellCta, VipCarousel } from "@/components/Sections";
import { getBuyers, getFeatured, getListings, getTotal } from "@/lib/api";
import { requestTime } from "@/lib/now";
import { parseQuery, toHref } from "@/lib/query";
import { site } from "@/lib/site";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
}

async function HomeContent({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  const sp = await searchParams;
  const query = parseQuery(sp);
  const now = requestTime();
  const filtered = !!(query.category || query.q || query.rooms || query.price_min || query.price_max);
  const [page, featured, total, buyers] = await Promise.all([
    getListings({ ...query, page: 1 }),
    filtered ? Promise.resolve([]) : getFeatured(query.deal),
    getTotal(),
    getBuyers(),
  ]);
  const params = Object.fromEntries(new URL(toHref(query), site.url).searchParams);

  return (
    <>
      <SearchPanel query={query} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {!filtered && <QuickLinks />}
        <VipCarousel items={featured} />

        <div className="mt-8 mb-3.5 flex items-center justify-between gap-3">
          <div>
            <b className="text-lg sm:text-xl">Topildi: {page.count.toLocaleString("ru-RU")}</b>
            <span className="hidden text-slate-500 sm:inline"> · jami {total.toLocaleString("ru-RU")} e’lon</span>
          </div>
          <SortSelect query={query} />
        </div>

        <div className={GRID}>
          {page.results.length ? (
            page.results.map((l, i) => <ListingCard key={l.code} l={l} now={now} eager={i < 4} />)
          ) : (
            <EmptyState
              title="Hech narsa topilmadi"
              text="Filtrlarni o‘zgartirib ko‘ring yoki ariza qoldiring: mos e’lon chiqsa, sizga xabar beramiz."
              action={
                <Link href="/ariza" className="rounded-xl bg-brand px-5 py-2.5 font-bold text-white">
                  Ariza qoldirish
                </Link>
              }
            />
          )}
          {page.next && <LoadMore key={toHref(query)} params={params} now={now} />}
        </div>

        {buyers.length > 0 && !filtered && (
          <section className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-extrabold tracking-tight">🙋 Xaridorlar izlayapti</h2>
              <Link href="/xaridorlar" className="text-sm font-semibold text-brand">
                Barchasi →
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {buyers.slice(0, 3).map((b) => (
                <BuyerCard key={b.id} b={b} now={now} />
              ))}
            </div>
          </section>
        )}

        <SellCta />
      </div>
    </>
  );
}

function HomeSkeleton() {
  return (
    <>
      <div className="h-56 bg-gradient-to-br from-brand to-brand-900 sm:h-64" />
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className={GRID}>
          {Array.from({ length: 8 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
