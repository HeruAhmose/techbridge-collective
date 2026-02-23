import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://techbridgecollective.org";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/navigator/", "/partner/", "/api/", "/demo", "/dashboard"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
