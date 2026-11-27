import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "hourly", priority: 1 },
    { url: `${site.url}/xarita`, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.url}/xaridorlar`, changeFrequency: "daily", priority: 0.6 },
    { url: `${site.url}/elon-berish`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/maxfiylik`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
