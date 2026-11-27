import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { FavoriteButton } from "@/components/FavoriteButton";
import { ContactButtons, ReportBox, ShareButton } from "@/components/listing/Actions";
import { Gallery } from "@/components/listing/Gallery";
import { Badge, GRID, ListingCard } from "@/components/ListingCard";
import { LeafletMap } from "@/components/map";
import { getListing, getSimilar } from "@/lib/api";
import { ago, attributeRows, categoryName, dealName, dealOf, money, priceText } from "@/lib/format";
import { requestTime } from "@/lib/now";
import { site } from "@/lib/site";
import type { ListingDetail } from "@/lib/types";

type Props = PageProps<"/e/[code]">;

const parseCode = (s: string) => (/^\d{1,9}$/.test(s) ? Number(s) : null);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const code = parseCode((await params).code);
  const l = code ? await getListing(code) : null;
  if (!l) return { title: "E’lon topilmadi" };
  const title = `${l.title} — ${priceText(l)}`;
  const description = `${dealName(dealOf(l))} · ${categoryName(l.category)} · ${l.mahalla ?? site.region}. ${l.description.slice(0, 140)}`;
  return {
    title,
    description,
    alternates: { canonical: `/e/${l.code}` },
    openGraph: { title, description, url: `/e/${l.code}`, images: l.images[0] ? [l.images[0].large] : undefined },
  };
}

export default function ListingPage({ params }: Props) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: Props["params"] }) {
  const code = parseCode((await params).code);
  const l = code ? await getListing(code) : null;
  if (!l) notFound();
  const now = requestTime();
  const similar = await getSimilar(l.code).catch(() => []);
  const deal = dealOf(l);
  const dropped = l.old_price != null && l.old_price > l.price;
  const lat = Number(l.lat);
  const lng = Number(l.lng);
  const hasMap = l.lat != null && l.lng != null && Number.isFinite(lat) && Number.isFinite(lng);

  const rows: [string, React.ReactNode][] = [];
  if (l.posted_by) rows.push(["Kim joylashtirdi", <span key="p" className={l.posted_by === "owner" ? "text-green-600" : ""}>{l.posted_by === "owner" ? "Egasi" : "Rieltor"}</span>]);
  rows.push(["Mulk turi", categoryName(l.category)]);
  rows.push(...attributeRows(l.attributes));
  rows.push(["E’lon raqami", `#${l.code}`]);

  const facts: [string, string][] = [];
  if (l.rooms) facts.push(["Xonalar", String(l.rooms)]);
  if (l.area_m2) facts.push(["Maydoni", `${Number(l.area_m2)} m²`]);
  if (l.land_area_sotix) facts.push(["Yer maydoni", `${Number(l.land_area_sotix)} sotix`]);
  if (l.floor != null) facts.push(["Qavat", l.total_floors ? `${l.floor} / ${l.total_floors}` : String(l.floor)]);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 md:pb-0">
        <nav className="hidden py-4 text-[13px] text-slate-500 md:block" aria-label="Yo‘l">
          <Link href="/" className="hover:text-brand">Bosh sahifa</Link> ›{" "}
          <Link href={deal === "sale" ? "/" : `/?deal=${deal}`} className="hover:text-brand">{dealName(deal)}</Link> ›{" "}
          <Link href={`/?${deal === "sale" ? "" : `deal=${deal}&`}cat=${l.category}`} className="hover:text-brand">{categoryName(l.category)}</Link> › #{l.code}
        </nav>

        <Gallery images={l.images} title={l.title} seed={l.code}>
          <div className="absolute top-3 right-3 flex gap-2">
            <ShareButton url={`/e/${l.code}`} title={l.title} className="grid size-10 place-items-center rounded-full bg-white/95 shadow" />
            <FavoriteButton code={l.code} className="size-10 shadow" />
          </div>
        </Gallery>

        <div className="mt-4 grid gap-7 md:mt-6 md:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <span className="rounded-md bg-brand-50 px-2 py-0.5 text-brand">{dealName(deal)}</span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700">{categoryName(l.category)}</span>
              {l.is_featured && <Badge kind="top" />}
              {l.status !== "active" && <Badge kind="sold" />}
              <span className="ml-auto font-normal text-slate-500">
                {ago(l.published_at, now)} · 👁 {l.views_count}
              </span>
            </div>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight sm:text-[28px]">{l.title}</h1>
            <div className="mt-1.5 text-[28px] font-extrabold tracking-tight sm:text-[32px]">{priceText(l)}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              {dropped && (
                <>
                  <span className="line-through">{money(l.old_price!, l.currency)}</span>
                  <Badge kind="drop" />
                </>
              )}
              {l.is_negotiable && <span>Kelishiladi</span>}
            </div>

            {facts.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {facts.map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="text-xs text-slate-500">{k}</div>
                    <b className="text-[17px]">{v}</b>
                  </div>
                ))}
              </div>
            )}

            {l.description && (
              <Box title="Tavsif">
                <p className="whitespace-pre-line text-slate-700">{l.description}</p>
              </Box>
            )}

            <Box title="Ma’lumotlar">
              <table className="w-full text-[15px]">
                <tbody>
                  {rows.map(([k, v]) => (
                    <tr key={k} className="border-b border-dashed border-slate-200 last:border-0">
                      <td className="py-2.5 text-slate-600">{k}</td>
                      <td className="py-2.5 text-right font-semibold">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            <Box title="Joylashuv">
              <div className="text-slate-600">📍 {[l.district, l.mahalla, l.address].filter(Boolean).join(", ")}</div>
              {hasMap && (
                <>
                  <div className="relative isolate mt-3 h-52 overflow-hidden rounded-xl">
                    <LeafletMap pins={[{ id: l.code, lat, lng, label: "📍" }]} activeId={l.code} zoom={15} interactive={false} />
                  </div>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} target="_blank" rel="noopener" className="mt-2 inline-block text-sm font-semibold text-brand">
                    Yo‘nalishni ochish →
                  </a>
                </>
              )}
            </Box>

            <ReportBox code={l.code} />
          </div>

          <aside className="md:sticky md:top-24 md:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-brand-100 text-lg font-extrabold text-brand">
                  {(l.contact_name || "U").slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <b>{l.contact_name || site.name}</b>
                  {l.posted_by && (
                    <div className={`text-[13px] font-semibold ${l.posted_by === "owner" ? "text-green-600" : "text-slate-500"}`}>
                      {l.posted_by === "owner" ? "✓ Egasi" : "Rieltor"}
                    </div>
                  )}
                </div>
              </div>
              <div className="hidden md:block">
                <ContactButtons phone={l.phone} telegram={l.telegram_username} />
              </div>
              <p className="mt-3 text-xs text-slate-500">Pul o‘tkazishdan oldin mulkni o‘z ko‘zingiz bilan ko‘ring va hujjatlarini tekshiring.</p>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-extrabold tracking-tight">O‘xshash e’lonlar</h2>
            <div className={GRID}>
              {similar.map((s) => (
                <ListingCard key={s.code} l={s} now={now} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* telefon: pastda doim turadigan aloqa paneli */}
      <div className="fixed inset-x-0 bottom-0 z-[1000] border-t border-slate-200 bg-white px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <ContactButtons phone={l.phone} telegram={l.telegram_username} compact />
      </div>
      <JsonLd l={l} />
    </>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h2 className="mb-2.5 text-[17px] font-bold">{title}</h2>
      {children}
    </section>
  );
}

function JsonLd({ l }: { l: ListingDetail }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: l.title,
    url: `${site.url}/e/${l.code}`,
    price: l.price,
    priceCurrency: l.currency,
    availability: l.status === "active" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    image: l.images.map((i) => i.large),
    areaServed: site.region,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
      <div className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100 md:aspect-auto md:h-[430px]" />
      <div className="mt-6 h-8 w-2/3 animate-pulse rounded bg-slate-100" />
      <div className="mt-3 h-9 w-1/3 animate-pulse rounded bg-slate-100" />
    </div>
  );
}
