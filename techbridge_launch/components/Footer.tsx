import Link from "next/link";

const LINKS = [
  { href: "/get-help",   label: "Get Help" },
  { href: "/host-a-hub", label: "Host a Hub" },
  { href: "/impact",     label: "Impact" },
  { href: "/about",      label: "About" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-linen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-sm font-semibold text-forest">TechBridge Collective</div>
            <div className="mt-1 text-xs text-ink/60 max-w-xs">
              Neighborhood tech help desks in Durham and Raleigh, NC. Powered by H.K. AI.
            </div>
            <div className="mt-2 text-xs text-ink/50 font-mono">
              No passwords. No SSNs. Bring your device if you can.
            </div>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-ink/70 no-underline hover:text-ink hover:underline underline-offset-4">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-ink/8 pt-5 text-xs text-ink/40">
          <span>© {new Date().getFullYear()} TechBridge Collective</span>
          <span className="font-mono">Non-PII metrics only</span>
        </div>
      </div>
    </footer>
  );
}
