import type { MetadataRoute } from "next";

import { getSitemapEntries } from "@/lib/api";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getSitemapEntries().catch(() => []);
  return [
    { url: site.url, changeFrequency: "hourly", priority: 1 },
    { url: `${site.url}/xarita`, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.url}/xaridorlar`, changeFrequency: "daily", priority: 0.6 },
    { url: `${site.url}/elon-berish`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/ariza`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/maxfiylik`, changeFrequency: "yearly", priority: 0.2 },
    ...listings.map((l) => ({
      url: `${site.url}/e/${l.code}`,
      lastModified: l.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
