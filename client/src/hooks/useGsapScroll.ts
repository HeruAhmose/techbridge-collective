import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Animate all children with .gsap-reveal class
    const items = el.querySelectorAll(".gsap-reveal");
    if (items.length === 0) return;

    gsap.set(items, { opacity: 0, y: 40 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
    });

    tl.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return ref;
}

export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      y: () => speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [speed]);

  return ref;
}

export function useTextReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = el.querySelectorAll(".char");
    if (chars.length === 0) return;

    gsap.set(chars, { opacity: 0, y: 20, rotateX: -90 });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.6,
      stagger: 0.02,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return ref;
}

export function useHorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const inner = el.querySelector(".h-scroll-inner") as HTMLElement;
    if (!inner) return;

    const totalWidth = inner.scrollWidth - el.offsetWidth;

    gsap.to(inner, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: true,
      },
    });
  }, []);

  return ref;
}

export { gsap, ScrollTrigger };
