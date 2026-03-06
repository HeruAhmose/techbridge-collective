/**
 * TechBridge Collective — Shared Footer
 * Bridge-themed footer with navigation links and contact info.
 */
import { Link } from 'wouter';

const FOOTER_LINKS = [
  { href: '/get-help', label: 'Get Help' },
  { href: '/host-a-hub', label: 'Host a Hub' },
  { href: '/impact', label: 'Impact' },
  { href: '/about', label: 'About' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#0F2B1F' }}>
      {/* CTA Banner */}
      <div className="py-12" style={{ background: 'linear-gradient(135deg, #1B4332, #0F2B1F)' }}>
        <div className="container text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: '#FDF8F0' }}>
            Ready to bring a hub to your community?
          </h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
            One 15-minute call. We bring the staffing, the system, and the reporting. You bring the space.
          </p>
          <a
            href="https://calendly.com/thetechbridgecollective/techbridge-15-min-pilot-call"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-display font-bold transition-all duration-300 hover:scale-105"
            style={{ background: '#C9A227', color: '#1B4332', boxShadow: '0 4px 20px rgba(201, 162, 39, 0.3)' }}
          >
            Book a Pilot Call
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M4 22 Q16 8 28 22" stroke="#C9A227" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <line x1="4" y1="22" x2="28" y2="22" stroke="#C9A227" strokeWidth="2" />
                <line x1="10" y1="22" x2="10" y2="15" stroke="#C9A227" strokeWidth="1.5" />
                <line x1="16" y1="22" x2="16" y2="11" stroke="#C9A227" strokeWidth="1.5" />
                <line x1="22" y1="22" x2="22" y2="15" stroke="#C9A227" strokeWidth="1.5" />
              </svg>
              <span className="font-display text-base font-bold" style={{ color: '#C9A227' }}>TechBridge Collective</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {FOOTER_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="text-sm transition-colors cursor-pointer hover:text-[#C9A227]" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div className="text-center md:text-right">
              <a href="https://techbridge-collective.org" className="text-sm transition-colors hover:text-[#C9A227]" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>
                techbridge-collective.org
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(201, 162, 39, 0.1)' }}>
            <p className="text-xs italic" style={{ color: 'rgba(253, 248, 240, 0.4)' }}>
              "Because the best technology in the world doesn't matter if no one shows you how to use it."
            </p>
            <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.3)' }}>
              Jonathan Peoples · Co-Founder · 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
