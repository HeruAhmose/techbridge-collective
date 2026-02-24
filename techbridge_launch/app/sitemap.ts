import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://techbridgecollective.org";
  const now  = new Date();

  const pages = [
    { url: base,              priority: 1.0, changeFrequency: "weekly"  },
    { url: `${base}/get-help`,  priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/host-a-hub`,priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/impact`,    priority: 0.8, changeFrequency: "daily"   },
    { url: `${base}/about`,     priority: 0.7, changeFrequency: "monthly" },
  ] as const;

  return pages.map((p) => ({ ...p, lastModified: now }));
}
