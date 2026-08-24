import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { triageHKRequest, type HKTriageResult } from "../lib/hkTriage";
import { tbSoundEngine } from "../lib/TBSoundEngine";

interface Message {
  id: string;
  role: "hk" | "user";
  text: string;
  timestamp: number;
  triage?: HKTriageResult;
}

const QUICK_ACTIONS = [
  {
    emoji: "🛡️",
    label: "Check a suspicious message",
    query: "I received a suspicious message and I think it may be a scam",
  },
  {
    emoji: "📧",
    label: "Recover my email",
    query: "I need help recovering my email account",
  },
  {
    emoji: "🌐",
    label: "Fix Wi-Fi",
    query: "My device cannot connect to Wi-Fi",
  },
  {
    emoji: "💼",
    label: "Apply for jobs",
    query: "I need help applying for a job online",
  },
  {
    emoji: "📱",
    label: "Set up my phone",
    query: "I need help setting up my phone",
  },
  {
    emoji: "📁",
    label: "Upload documents",
    query: "I need help uploading a document to an online form",
  },
  {
    emoji: "🏥",
    label: "Set up telehealth",
    query: "I need technical help setting up a telehealth visit",
  },
];

const WELCOME =
  "I’m H.K. — TechBridge Collective’s male Help Desk Architect, inspired by Horace King, the master bridge builder. I’m not an impersonation of the historical Horace King.\n\nI use a deterministic triage process: stabilize risk, classify the issue, collect only the evidence needed, recommend a safe next step, and flag cases that need a person.\n\nDescribe what stopped you, or choose a quick start below. Never send passwords, SSNs, bank information, or verification codes.";

function HKMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-full ${compact ? "h-8 w-8" : "h-11 w-11"}`}
      style={{
        background:
          "radial-gradient(circle at 35% 30%, rgba(201,162,39,.3), transparent 38%), linear-gradient(145deg, #214f3c, #0b2118)",
        border: "1.5px solid rgba(201, 162, 39, 0.75)",
        boxShadow: "inset 0 0 18px rgba(201,162,39,.08)",
      }}
      aria-hidden="true"
    >
      <span
        className={compact ? "text-[9px] font-bold" : "text-xs font-bold"}
        style={{ color: "#E4C663", letterSpacing: "0.12em" }}
      >
        HK
      </span>
      <svg
        className="absolute bottom-1 left-1/2 -translate-x-1/2"
        width={compact ? "18" : "27"}
        height={compact ? "5" : "7"}
        viewBox="0 0 28 7"
        fill="none"
      >
        <path
          d="M1 6h26M3 6c2.3-5.2 6.8-5.2 9 0M12 6c2.3-5.2 6.8-5.2 9 0M21 6c1.4-2.7 3.2-3.5 5-2.4"
          stroke="#C9A227"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

function PriorityBadge({ triage }: { triage: HKTriageResult }) {
  const isUrgent = triage.priority === "urgent";
  const isHigh = triage.priority === "high";

  return (
    <div
      className="mt-2 flex flex-wrap gap-1.5"
      aria-label="H.K. triage result"
    >
      <span
        className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
        style={{
          color: "#E4C663",
          background: "rgba(201,162,39,.08)",
          border: "1px solid rgba(201,162,39,.2)",
        }}
      >
        {triage.categoryLabel}
      </span>
      <span
        className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
        style={{
          color: isUrgent ? "#FCA5A5" : isHigh ? "#FDE68A" : "#A7F3D0",
          background: isUrgent
            ? "rgba(127,29,29,.22)"
            : isHigh
              ? "rgba(120,53,15,.2)"
              : "rgba(6,78,59,.18)",
          border: isUrgent
            ? "1px solid rgba(248,113,113,.3)"
            : isHigh
              ? "1px solid rgba(251,191,36,.25)"
              : "1px solid rgba(52,211,153,.18)",
        }}
      >
        {triage.priority} · {triage.stage}
      </span>
    </div>
  );
}

export default function HKChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hasInteracted) return;
    const show = window.setTimeout(() => setShowTooltip(true), 3000);
    const hide = window.setTimeout(() => setShowTooltip(false), 8000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [hasInteracted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) window.setTimeout(() => inputRef.current?.focus(), 250);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      tbSoundEngine.play("hk_close");
      setIsOpen(false);
      toggleButtonRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const toggleChat = useCallback(() => {
    setHasInteracted(true);
    setShowTooltip(false);

    if (isOpen) {
      tbSoundEngine.play("hk_close");
      setIsOpen(false);
      return;
    }

    tbSoundEngine.init();
    tbSoundEngine.play("hk_open");
    setIsOpen(true);
    setMessages(current =>
      current.length
        ? current
        : [
            {
              id: "welcome",
              role: "hk",
              text: WELCOME,
              timestamp: Date.now(),
            },
          ]
    );
  }, [isOpen]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: Date.now(),
    };

    setMessages(current => [...current, userMsg]);
    setInput("");
    setIsTyping(true);
    tbSoundEngine.play("hk_typing");

    window.setTimeout(() => {
      const triage = triageHKRequest(trimmed);
      const hkMsg: Message = {
        id: `hk-${Date.now()}`,
        role: "hk",
        text: triage.response,
        timestamp: Date.now(),
        triage,
      };
      setMessages(current => [...current, hkMsg]);
      setIsTyping(false);
      tbSoundEngine.play("hk_message");
    }, 360);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.96 }}
              className="relative max-w-[220px] rounded-xl px-4 py-2.5 shadow-lg"
              style={{
                background: "#102d21",
                color: "#FDF8F0",
                border: "1px solid rgba(201,162,39,.18)",
                boxShadow: "0 12px 40px rgba(0,0,0,.3)",
              }}
            >
              <p className="text-sm font-semibold">Need tech help?</p>
              <p className="mt-0.5 text-xs" style={{ color: "#D8B84A" }}>
                Ask H.K. · deterministic triage
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          ref={toggleButtonRef}
          data-hk-launcher="true"
          onClick={toggleChat}
          className="relative flex h-16 min-w-16 items-center justify-center gap-3 rounded-full px-2.5 shadow-2xl sm:min-w-[204px] sm:justify-start sm:pr-5"
          style={{
            background: "#0F2B1F",
            border: "2px solid #C9A227",
            boxShadow:
              "0 10px 36px rgba(15,43,31,.46), 0 0 24px rgba(201,162,39,.16)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={isOpen ? "Close H.K. triage" : "Open H.K. triage"}
        >
          {isOpen ? (
            <motion.svg
              initial={{ rotate: -60, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#C9A227"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </motion.svg>
          ) : (
            <HKMark />
          )}
          <div className="hidden min-w-0 text-left sm:block">
            <p
              className="text-sm font-bold leading-tight"
              style={{ color: "#FDF8F0" }}
            >
              {isOpen ? "Close H.K." : "H.K."}
            </p>
            <p
              className="mt-0.5 text-[10px] font-mono uppercase tracking-[0.12em]"
              style={{ color: "#D8B84A" }}
            >
              {isOpen ? "Return to site" : "Help Desk Architect"}
            </p>
          </div>
          <span
            className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2"
            style={{ background: "#34D399", borderColor: "#0F2B1F" }}
            aria-hidden="true"
          />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="H.K. Help Desk Architect"
            className="fixed bottom-28 right-6 z-50 flex w-[400px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{
              background: "#0B2118",
              border: "1px solid rgba(201,162,39,.26)",
              boxShadow:
                "0 26px 70px rgba(0,0,0,.44), 0 0 46px rgba(201,162,39,.07)",
              maxHeight: "min(650px, calc(100vh - 9.5rem))",
            }}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{
                background: "rgba(27,67,50,.42)",
                borderBottom: "1px solid rgba(201,162,39,.14)",
              }}
            >
              <HKMark />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-sm font-bold text-[#FDF8F0]">
                  H.K.{" "}
                  <span className="font-normal opacity-55">
                    Help Desk Architect
                  </span>
                </h3>
                <p className="mt-0.5 text-[11px] text-emerald-300/80">
                  Male AI guide · inspired by Horace King
                </p>
              </div>
              <div
                className="rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]"
                style={{
                  color: "#D8B84A",
                  background: "rgba(201,162,39,.07)",
                  border: "1px solid rgba(201,162,39,.14)",
                }}
              >
                Triage beta
              </div>
            </div>

            <div
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
              style={{ minHeight: "210px", maxHeight: "370px" }}
            >
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "hk" && (
                    <div className="mr-2 mt-1 shrink-0">
                      <HKMark compact />
                    </div>
                  )}
                  <div className="max-w-[84%]">
                    <div
                      className="rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
                      style={
                        message.role === "hk"
                          ? {
                              background: "rgba(45,106,79,.17)",
                              color: "#FDF8F0",
                              border: "1px solid rgba(45,106,79,.26)",
                              borderBottomLeftRadius: "5px",
                            }
                          : {
                              background: "rgba(201,162,39,.13)",
                              color: "#FDF8F0",
                              border: "1px solid rgba(201,162,39,.22)",
                              borderBottomRightRadius: "5px",
                            }
                      }
                    >
                      {message.text}
                    </div>
                    {message.triage && (
                      <PriorityBadge triage={message.triage} />
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <HKMark compact />
                  <div
                    className="flex gap-1 rounded-2xl px-4 py-3"
                    style={{ background: "rgba(45,106,79,.17)" }}
                    aria-label="H.K. is triaging"
                  >
                    {[0, 1, 2].map(index => (
                      <motion.span
                        key={index}
                        className="h-1.5 w-1.5 rounded-full bg-[#C9A227]"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.62,
                          repeat: Infinity,
                          delay: index * 0.14,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-3">
                <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.15em] text-white/35">
                  Start a triage path
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACTIONS.map(action => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => {
                        tbSoundEngine.play("nav_click");
                        sendMessage(action.query);
                      }}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium transition-transform hover:scale-[1.03]"
                      style={{
                        background: "rgba(201,162,39,.07)",
                        color: "#D8B84A",
                        border: "1px solid rgba(201,162,39,.16)",
                      }}
                    >
                      {action.emoji} {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div
              className="px-4 py-2.5"
              style={{
                background: "rgba(45,106,79,.08)",
                borderTop: "1px solid rgba(201,162,39,.08)",
              }}
            >
              <p className="text-[11px] leading-relaxed text-white/45">
                <strong className="text-white/60">Privacy boundary:</strong>{" "}
                H.K. triage is deterministic in this interface. Do not enter
                passwords, SSNs, bank information, medical details, or
                verification codes.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderTop: "1px solid rgba(201,162,39,.12)" }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={event => setInput(event.target.value)}
                onFocus={() => tbSoundEngine.play("form_focus")}
                placeholder="Describe the issue, not your secrets…"
                autoComplete="off"
                className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  background: "rgba(253,248,240,.055)",
                  color: "#FDF8F0",
                  border: "1px solid rgba(201,162,39,.18)",
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send issue to H.K. triage"
                className="grid h-10 w-10 place-items-center rounded-xl transition-transform hover:scale-105 disabled:opacity-30"
                style={{ background: "#C9A227", color: "#102d21" }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>

            <div
              className="flex items-center justify-between gap-3 px-4 py-2"
              style={{ borderTop: "1px solid rgba(201,162,39,.07)" }}
            >
              <p className="text-[10px] italic text-white/30">
                Horace King inspired · bridge the problem to a safe next step
              </p>
              <a
                href="/get-help"
                className="shrink-0 text-[10px] font-semibold text-[#C9A227] hover:underline"
              >
                Current help status →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
