import { useMemo, useState, type ImgHTMLAttributes } from "react";
import BridgeSVG from "./BridgeSVG";

const BLOCKED_LEGACY_HOST = "d2xsxph8kpxj0f.cloudfront.net";

type VisualKind =
  | "bridge"
  | "hk"
  | "history"
  | "navigator"
  | "community"
  | "journey"
  | "hub"
  | "success"
  | "general";

function classify(src: string): VisualKind {
  const value = src.toLowerCase();
  if (value.includes("hk_avatar")) return "hk";
  if (value.includes("horace-king")) return "history";
  if (value.includes("bridge")) return "bridge";
  if (value.includes("navigator-session") || value.includes("community-navigator")) return "navigator";
  if (value.includes("community-gathering") || value.includes("community-hub")) return "community";
  if (value.includes("span-journey")) return "journey";
  if (value.includes("hub-exterior")) return "hub";
  if (value.includes("success-moment")) return "success";
  return "general";
}

function BridgeGlyph({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 72"
      aria-hidden="true"
      className={compact ? "h-8 w-12" : "h-14 w-24"}
      fill="none"
    >
      <path d="M8 56 Q60 3 112 56" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M8 56 H112" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {[28, 44, 60, 76, 92].map((x, index) => (
        <path key={x} d={`M${x} 56 V${30 - Math.abs(2 - index) * 4}`} stroke="currentColor" strokeWidth="2" opacity="0.65" />
      ))}
    </svg>
  );
}

const KIND_COPY: Record<VisualKind, { eyebrow: string; title: string; detail: string }> = {
  bridge: {
    eyebrow: "DIGITAL EQUITY INFRASTRUCTURE",
    title: "The bridge is the system.",
    detail: "Access · navigation · skills · trust · opportunity",
  },
  hk: {
    eyebrow: "H.K. · HELP DESK ARCHITECT",
    title: "H.K.",
    detail: "Safety-first triage · human escalation",
  },
  history: {
    eyebrow: "THE BUILDER'S LINEAGE",
    title: "Horace King",
    detail: "Bridge-building discipline informs the H.K. name and service ethic.",
  },
  navigator: {
    eyebrow: "DIGITAL NAVIGATORS",
    title: "Guidance beside you.",
    detail: "Human-first help, one practical crossing at a time.",
  },
  community: {
    eyebrow: "COMMUNITY HUB",
    title: "Trusted space. Useful help.",
    detail: "Local infrastructure designed around repeatable access.",
  },
  journey: {
    eyebrow: "SPAN ARCHITECTURE",
    title: "From need to capability.",
    detail: "A visible operating path from first contact to durable confidence.",
  },
  hub: {
    eyebrow: "NEIGHBORHOOD INFRASTRUCTURE",
    title: "A place to cross.",
    detail: "Libraries and community sites become reliable digital access points.",
  },
  success: {
    eyebrow: "PRACTICAL OUTCOME",
    title: "Capability transferred.",
    detail: "The goal is not a completed task alone—it is greater independence next time.",
  },
  general: {
    eyebrow: "TECHBRIDGE COLLECTIVE",
    title: "Infrastructure made visible.",
    detail: "Human support, measured service, and digital access working as one system.",
  },
};

function FallbackVisual({ kind }: { kind: VisualKind }) {
  const copy = KIND_COPY[kind];

  if (kind === "bridge") {
    return (
      <div
        data-resilient-visual="bridge"
        className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#071b14]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_28%,rgba(232,185,49,.18),transparent_32%),radial-gradient(circle_at_20%_72%,rgba(0,212,170,.12),transparent_34%)]" />
        <div className="absolute inset-x-[4%] bottom-[12%] opacity-95">
          <BridgeSVG progress={1} className="w-full" />
        </div>
        <div className="absolute left-[6%] top-[10%] max-w-[500px]">
          <p className="text-[10px] font-bold tracking-[.28em] text-[#00D4AA]/75">{copy.eyebrow}</p>
          <p className="mt-3 font-display text-[clamp(2rem,5vw,5rem)] leading-[.86] text-[#FDF8F0]">{copy.title}</p>
          <p className="mt-4 text-xs tracking-[.12em] text-[#E8B931]/80">{copy.detail}</p>
        </div>
      </div>
    );
  }

  if (kind === "hk") {
    return (
      <div
        data-resilient-visual="hk"
        className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_38%,rgba(232,185,49,.20),transparent_45%),linear-gradient(145deg,#102b20,#07140f)]"
      >
        <div className="absolute inset-[9%] rounded-full border border-[#E8B931]/25" />
        <div className="absolute inset-[20%] rounded-full border border-[#00D4AA]/20" />
        <div className="relative flex h-full w-full flex-col items-center justify-center text-center text-[#E8B931]">
          <BridgeGlyph compact />
          <span className="mt-1 font-display text-[clamp(1.25rem,4vw,3.1rem)] font-black tracking-[.08em]">H.K.</span>
          <span className="mt-1 max-w-[90%] text-[7px] font-bold uppercase tracking-[.18em] text-[#FDF8F0]/65 sm:text-[9px]">Help Desk Architect</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-resilient-visual={kind}
      className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#102b20_0%,#07140f_55%,#0d241b_100%)]"
    >
      <div className="absolute -right-[12%] -top-[18%] h-[70%] w-[70%] rounded-full border border-[#E8B931]/12" />
      <div className="absolute -bottom-[28%] -left-[8%] h-[76%] w-[76%] rounded-full border border-[#00D4AA]/12" />
      <div className="absolute inset-0 opacity-[.12] [background-image:linear-gradient(rgba(232,185,49,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,170,.25)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute inset-0 flex flex-col justify-end p-[8%]">
        <div className="mb-3 text-[#E8B931]"><BridgeGlyph /></div>
        <p className="text-[9px] font-bold uppercase tracking-[.24em] text-[#00D4AA]/75">{copy.eyebrow}</p>
        <p className="mt-2 max-w-[90%] font-display text-[clamp(1.4rem,3vw,3.2rem)] leading-[.95] text-[#FDF8F0]">{copy.title}</p>
        <p className="mt-3 max-w-[88%] text-[10px] leading-relaxed text-[#FDF8F0]/52 sm:text-xs">{copy.detail}</p>
      </div>
    </div>
  );
}

export default function ResilientMedia({
  src = "",
  alt = "",
  className = "",
  style,
  onError,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const source = typeof src === "string" ? src : "";
  const isBlockedLegacyAsset = source.includes(BLOCKED_LEGACY_HOST);
  const [failed, setFailed] = useState(isBlockedLegacyAsset);
  const kind = useMemo(() => classify(source), [source]);

  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={style}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      data-media-state={failed ? "fallback" : "remote"}
      data-media-kind={kind}
    >
      <FallbackVisual kind={kind} />
      {!failed && source && (
        <img
          {...props}
          src={source}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={style}
          onError={(event) => {
            setFailed(true);
            onError?.(event);
          }}
        />
      )}
    </span>
  );
}
