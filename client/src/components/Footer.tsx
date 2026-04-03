/**
 * TechBridge Collective — Footer
 * Tech-forward footer with glassmorphism, neon glow, circuit patterns.
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { tbSoundEngine } from "../lib/TBSoundEngine";

const FOOTER_LINKS = [
  { href: "/get-help", label: "Get Help" },
  { href: "/host-a-hub", label: "Host a Hub" },
  { href: "/impact", label: "Impact" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--tb-forest)" }}>
      {/* CTA Banner — Glassmorphism */}
      <div
        className="relative py-16 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--tb-forest-light), var(--tb-forest))",
        }}
      >
        {/* Circuit background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.04 }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 800 200"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M0 100 H200 V50 H400 V150 H600 V100 H800"
              stroke="#E8B931"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M0 150 H150 V100 H350 V50 H550 V150 H800"
              stroke="#00D4AA"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            {[
              { x: 200, y: 100 },
              { x: 400, y: 50 },
              { x: 600, y: 100 },
              { x: 150, y: 150 },
              { x: 350, y: 100 },
              { x: 550, y: 50 },
            ].map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="3"
                fill="#E8B931"
                opacity="0.4"
              />
            ))}
          </svg>
        </div>

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2
              className="font-display text-2xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--tb-cream)" }}
            >
              Ready to bring a hub to{" "}
              <span className="text-glow-gold">your community</span>?
            </h2>
            <p
              className="text-sm mb-8 max-w-lg mx-auto"
              style={{ color: "rgba(253, 248, 240, 0.5)" }}
            >
              One 15-minute call. We bring the staffing, the system, and the
              reporting. You bring the space.
            </p>
            <a
              href="https://calendly.com/aitconsult22/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="tb-btn tb-btn-primary !text-base !px-10 !py-4"
              onClick={() => tbSoundEngine.play("nav_click")}
            >
              Book a Pilot Call
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m-7-7l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Glowing divider */}
      <div className="section-divider-glow !m-0" />

      {/* Main Footer */}
      <div className="py-14" style={{ background: "var(--tb-forest)" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3 group">
              <svg
                width="32"
                height="32"
                viewBox="0 0 36 36"
                fill="none"
                className="transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(232,185,49,0.5)]"
              >
                <path
                  d="M4 26 Q18 8 32 26"
                  stroke="#E8B931"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <line
                  x1="4"
                  y1="26"
                  x2="32"
                  y2="26"
                  stroke="#E8B931"
                  strokeWidth="2"
                />
                <line
                  x1="11"
                  y1="26"
                  x2="11"
                  y2="17"
                  stroke="#00D4AA"
                  strokeWidth="1.5"
                  opacity="0.7"
                />
                <line
                  x1="18"
                  y1="26"
                  x2="18"
                  y2="12"
                  stroke="#E8B931"
                  strokeWidth="1.5"
                />
                <line
                  x1="25"
                  y1="26"
                  x2="25"
                  y2="17"
                  stroke="#00D4AA"
                  strokeWidth="1.5"
                  opacity="0.7"
                />
              </svg>
              <span className="font-display text-base font-bold text-glow-gold">
                TechBridge Collective
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {FOOTER_LINKS.map(link => (
                <Link key={link.href} href={link.href}>
                  <span
                    className="text-sm transition-all duration-300 cursor-pointer hover:text-[#E8B931]"
                    style={{ color: "rgba(253, 248, 240, 0.5)" }}
                    onClick={() => tbSoundEngine.play("nav_click")}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div className="text-center md:text-right">
              <a
                href="https://techbridge-collective.org"
                className="text-sm transition-all duration-300 hover:text-[#E8B931]"
                style={{ color: "rgba(253, 248, 240, 0.5)" }}
              >
                techbridge-collective.org
              </a>
            </div>
          </div>

          <div
            className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(232, 185, 49, 0.08)" }}
          >
            <p
              className="text-xs italic"
              style={{ color: "rgba(253, 248, 240, 0.3)" }}
            >
              "Because the best technology in the world doesn't matter if no one
              shows you how to use it."
            </p>
            <p
              className="text-xs font-mono"
              style={{ color: "rgba(0, 212, 170, 0.3)" }}
            >
              Jonathan Peoples · Co-Founder · 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
