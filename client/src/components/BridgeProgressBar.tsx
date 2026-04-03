/**
 * BridgeProgressBar — Scroll-linked bridge building progress indicator
 *
 * A thin bar at the top of the page that visually "builds" a bridge
 * as the user scrolls through the page. Golden shimmer effect.
 */
import { useState, useEffect } from "react";

export default function BridgeProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setProgress(pct * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[51] h-[3px]"
      style={{ background: "rgba(15, 43, 31, 0.3)" }}
    >
      <div
        className="h-full transition-[width] duration-100 ease-linear"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #1B4332, #C9A227, #E8C84A)",
          boxShadow: "0 0 10px rgba(201, 162, 39, 0.5)",
        }}
      />
    </div>
  );
}
