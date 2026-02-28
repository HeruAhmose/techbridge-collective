import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Outfit, Cormorant_Garamond, DM_Mono } from "next/font/google";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { HKBubble } from "@/components/HKWidget";
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["600","700"], style: ["normal","italic"], variable: "--font-cormorant", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400","500"], variable: "--font-dm-mono", display: "swap" });
export const viewport: Viewport = { themeColor: "#0c1a14", width: "device-width", initialScale: 1 };
export const metadata: Metadata = {
  title: { default: "TechBridge Collective — Tech help, right in your neighborhood", template: "%s · TechBridge Collective" },
  description: "Neighborhood tech help desks and Digital Navigators in Durham and Raleigh NC, powered by H.K. AI and TechMinutes® reporting.",
  keywords: ["digital equity","tech help","Durham","Raleigh","Digital Navigator","TechMinutes"],
  authors: [{ name: "TechBridge Collective" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  icons: {
    icon: "/images/hk/HK_favicon_32.png",
    apple: "/images/hk/HK_apple_touch_icon.png",
  },
  openGraph: { type: "website", siteName: "TechBridge Collective", title: "TechBridge Collective — Tech help, right in your neighborhood", description: "Free 1:1 Digital Navigator support at Durham County Library and Raleigh Digital Impact. Powered by H.K. AI.", locale: "en_US", images: [{ url: "/images/hk/HK_og_image.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary", title: "TechBridge Collective", description: "Free neighborhood tech help desks in Durham and Raleigh, NC." },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontClasses = [outfit.variable, cormorant.variable, dmMono.variable].join(" ");
  return (
    <html lang="en" className={fontClasses}>
      <body className="font-sans antialiased">
        <ClerkProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink">
            Skip to content
          </a>
          <SiteNav user={null} />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
          <HKBubble />
        </ClerkProvider>
      </body>
    </html>
  );
}
