import Link from "next/link";
import { Button, cn } from "@/components/ui";
import type { SignedInUser } from "@/lib/auth/getSignedInUser";
import UserMenu from "@/components/UserMenu";

const NAV_ITEMS = [
  { href: "/get-help",   label: "Get Help" },
  { href: "/host-a-hub", label: "Host a Hub" },
  { href: "/impact",     label: "TechMinutes® Impact" },
  { href: "/about",      label: "About" },
];

const linkBase =
  "rounded-md px-3 py-2 text-sm font-medium text-cream/75 no-underline transition hover:text-cream hover:bg-white/5";

export default function SiteNav({ user }: { user: SignedInUser | null }) {
  const showNavigator = user?.role === "NAVIGATOR" || user?.role === "ADMIN";
  const showPartner   = user?.role === "PARTNER"   || user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-ink/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 no-underline" aria-label="TechBridge Collective home">
          <span className="font-semibold tracking-tight text-cream">TechBridge</span>
          <span className="font-semibold tracking-tight text-gold">Collective</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-0.5 md:flex">
          {NAV_ITEMS.map((it) => (
            <Link key={it.href} href={it.href} className={linkBase}>{it.label}</Link>
          ))}
          {showNavigator && (
            <Link href="/navigator" className={cn(linkBase, "text-teal/80 hover:text-teal")}>Navigators</Link>
          )}
          {showPartner && (
            <Link href="/partner" className={cn(linkBase, "text-teal/80 hover:text-teal")}>Partner</Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Dashboard link — interactive analytics for stakeholders */}
          <Link
            href="/dashboard"
            className="hidden items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[11px] font-semibold text-gold/80 no-underline transition hover:bg-gold/20 hover:text-gold md:inline-flex"
            title="Open TechMinutes® interactive dashboard"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold/70 animate-pulse" aria-hidden />
            Dashboard
          </Link>
          <Link href="/get-help#hk" className="hidden md:block">
            <Button>Ask H.K. AI</Button>
          </Link>
          <Link href="/host-a-hub#book" className="hidden md:block">
            <Button variant="outline" className="border-gold/40 bg-transparent text-cream hover:bg-white/5">
              Book a Call
            </Button>
          </Link>
          <UserMenu />
        </div>

      </div>
    </header>
  );
}
