import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";

const NAV_LINKS = [
  { href: "#tech", label: "Technology", id: "tech" },
  { href: "#comp", label: "Material", id: "comp" },
  { href: "#energy", label: "Energy", id: "energy" },
  { href: "#apps", label: "Applications", id: "apps" },
  { href: "#ip", label: "Patents", id: "ip" },
  { href: "#about", label: "About", id: "about" },
];

export default function Navigation({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((s) => {
        if (window.scrollY >= (s as HTMLElement).offsetTop - 260) {
          current = s.id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    play("click");
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-400"
        style={{
          padding: scrolled ? "0.8rem 4vw" : "1.2rem 4vw",
          background: scrolled ? "rgba(3,3,8,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(240,232,216,0.08)" : "1px solid transparent",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }}
          className="flex items-center gap-3 group"
        >
          <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
            <path
              d="M16 2L30 10v12L16 30 2 22V10z"
              stroke="rgba(69,232,216,0.5)"
              strokeWidth="0.8"
              className="transition-all duration-300 group-hover:stroke-[#45e8d8]"
            />
            <circle cx="16" cy="16" r="3" fill="rgba(69,232,216,0.6)" className="transition-all duration-300 group-hover:fill-[#45e8d8]" />
          </svg>
          <span
            className="text-lg font-semibold tracking-wider"
            style={{ fontFamily: "'Playfair Display', serif", color: "#f0e8d8" }}
          >
            Tamerian
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8 list-none">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                onMouseEnter={() => play("hover")}
                className="relative text-xs font-semibold tracking-[0.08em] uppercase transition-colors duration-300"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  color: activeSection === link.id ? "#45e8d8" : "#a8a0b8",
                  padding: "0.5rem 0.2rem",
                }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-0 h-[2px] transition-all duration-350"
                  style={{
                    width: activeSection === link.id ? "100%" : "0%",
                    background: "#45e8d8",
                  }}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
          onMouseEnter={() => play("hover")}
          className="hidden md:block relative text-xs font-bold tracking-[0.1em] uppercase overflow-hidden group/btn"
          style={{
            padding: "0.65rem 1.5rem",
            border: "1px solid #28a89c",
            color: "#45e8d8",
          }}
        >
          <span className="absolute inset-0 bg-[#45e8d8] origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-400" />
          <span className="relative z-10 group-hover/btn:text-[#030308] transition-colors duration-400">Contact</span>
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1 bg-transparent border-0"
          onClick={() => { setMobileOpen(!mobileOpen); play("click"); }}
          aria-label="Menu"
        >
          <motion.span
            className="block w-6 h-[2px]"
            style={{ background: "#f0e8d8" }}
            animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="block w-6 h-[2px]"
            style={{ background: "#f0e8d8" }}
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="block w-6 h-[2px]"
            style={{ background: "#f0e8d8" }}
            animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
          />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
            style={{ background: "rgba(3,3,8,0.97)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.id}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="text-xl font-semibold tracking-wider uppercase"
                style={{ fontFamily: "'Playfair Display', serif", color: "#f0e8d8" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
              className="mt-4 text-sm font-bold tracking-[0.1em] uppercase px-8 py-3"
              style={{ border: "1px solid #45e8d8", color: "#45e8d8" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Contact
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
