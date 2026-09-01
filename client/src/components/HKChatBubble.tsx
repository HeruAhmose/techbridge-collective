/**
 * H.K. — TechBridge's deterministic Help Desk Architect.
 *
 * The recovered H.K. identity system is presentation only; triage remains
 * local, bounded, privacy-first, and covered by hkTriage regression tests.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { triageHKRequest, type HKTriageResult } from "../lib/hkTriage";
import { tbSoundEngine } from "../lib/TBSoundEngine";

const HK_AVATAR = "/images/hk/HK_avatar_1024.jpg";
const HK_BUBBLE_ICON = "/images/hk/HK_bubble_icon_512.png";

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

  // Show tooltip after 3 seconds if not interacted
  useEffect(() => {
    if (hasInteracted) return;
    const t = setTimeout(() => setShowTooltip(true), 3000);
    const t2 = setTimeout(() => setShowTooltip(false), 8000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [hasInteracted]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Close on Escape, and return focus to the toggle button for keyboard users
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        tbSoundEngine.play("hk_close");
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (query: string) => {
    tbSoundEngine.play("nav_click");
    sendMessage(query);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <div className="fixed bottom-4 right-3 z-[2147483200] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="relative max-w-[220px] rounded-xl px-4 py-2.5 shadow-lg"
              style={{
                background: "#1B4332",
                color: "#FDF8F0",
                boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
              }}
            >
              <p className="text-sm font-medium">Need tech help?</p>
              <p className="text-xs mt-0.5" style={{ color: "#C9A227" }}>
                Ask H.K. — deterministic triage
              </p>
              <div
                className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0"
                style={{
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderLeft: "8px solid #1B4332",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Named H.K. system launcher */}
        <motion.button
          type="button"
          ref={toggleButtonRef}
          onClick={toggleChat}
          data-hk-launcher="true"
          className="relative flex h-16 items-center gap-2 rounded-full p-1 pr-3 text-left shadow-2xl sm:gap-3 sm:p-1.5 sm:pr-4"
          style={{
            background:
              "linear-gradient(120deg, rgba(8, 29, 19, 0.97), rgba(24, 72, 50, 0.98))",
            border: "1px solid rgba(232, 185, 49, 0.7)",
            boxShadow:
              "0 16px 42px rgba(0, 0, 0, 0.44), 0 0 30px rgba(232, 185, 49, 0.2), inset 0 0 20px rgba(0, 212, 170, 0.06)",
          }}
          whileHover={{ y: -3, scale: 1.025 }}
          whileTap={{ scale: 0.98 }}
          animate={
            isOpen
              ? {}
              : {
                  boxShadow: [
                    "0 16px 42px rgba(0, 0, 0, 0.44), 0 0 24px rgba(232, 185, 49, 0.16), inset 0 0 20px rgba(0, 212, 170, 0.06)",
                    "0 16px 42px rgba(0, 0, 0, 0.44), 0 0 42px rgba(232, 185, 49, 0.34), inset 0 0 24px rgba(0, 212, 170, 0.1)",
                    "0 16px 42px rgba(0, 0, 0, 0.44), 0 0 24px rgba(232, 185, 49, 0.16), inset 0 0 20px rgba(0, 212, 170, 0.06)",
                  ],
                }
          }
          transition={
            isOpen ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={isOpen ? "Close H.K. triage" : "Open H.K. triage"}
        >
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center sm:h-[52px] sm:w-[52px]">
            <motion.span
              aria-hidden="true"
              className="absolute -inset-1 rounded-full"
              style={{
                background:
                  "conic-gradient(from 90deg, transparent 0deg, rgba(0,212,170,0.9) 80deg, transparent 145deg, rgba(232,185,49,0.95) 250deg, transparent 325deg)",
                filter: "blur(0.2px)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <span
              className="relative h-11 w-11 overflow-hidden rounded-full sm:h-12 sm:w-12"
              style={{
                background: "#0a1f14",
                border: "2px solid rgba(232, 185, 49, 0.92)",
                boxShadow:
                  "0 0 22px rgba(0, 212, 170, 0.24), inset 0 0 12px rgba(0, 212, 170, 0.16)",
              }}
            >
              <img
                src={HK_BUBBLE_ICON}
                alt=""
                className="h-full w-full object-cover"
              />
              <motion.span
                aria-hidden="true"
                className="absolute left-1 right-1 h-px"
                style={{
                  top: "50%",
                  background: "rgba(0, 212, 170, 0.95)",
                  boxShadow: "0 0 8px rgba(0, 212, 170, 0.9)",
                }}
                animate={{ y: [-18, 18, -18], opacity: [0.25, 0.9, 0.25] }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </span>
            <span
              aria-hidden="true"
              className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2"
              style={{
                background: "#22c55e",
                borderColor: "#0a1f14",
                boxShadow: "0 0 10px rgba(34, 197, 94, 0.75)",
              }}
            />
          </span>

          <span className="min-w-0">
            <span
              className="block whitespace-nowrap font-display text-sm font-bold leading-none sm:text-base"
              style={{ color: "#FDF8F0" }}
            >
              {isOpen ? "Close H.K." : "H.K."}
            </span>
            <span
              className="mt-1 block whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.08em] sm:text-[11px] sm:tracking-[0.12em]"
              style={{ color: "#E8B931" }}
            >
              Help Desk Architect
            </span>
            <span
              className="mt-1 hidden items-center gap-1.5 whitespace-nowrap text-[10px] sm:flex"
              style={{ color: "rgba(253, 248, 240, 0.62)" }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "#22c55e" }}
              />
              Guidance online · 24/7
            </span>
          </span>

          {isOpen && (
            <motion.span
              aria-hidden="true"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="ml-1 hidden h-7 w-7 items-center justify-center rounded-full sm:flex"
              style={{
                color: "#E8B931",
                border: "1px solid rgba(232, 185, 49, 0.42)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.span>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            aria-label="Close H.K. triage"
            className="fixed inset-0 z-[2147483000] bg-black/70 sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleChat}
          />
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="H.K. Help Desk Architect"
            className="fixed bottom-[5.75rem] right-3 z-[2147483100] flex w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-3xl shadow-2xl sm:bottom-28 sm:right-6 sm:w-[420px]"
            style={{
              background:
                "linear-gradient(180deg, #123724 0%, #081a11 68%, #06130d 100%)",
              border: "1px solid rgba(232, 185, 49, 0.56)",
              boxShadow:
                "0 30px 90px rgba(0,0,0,0.62), 0 0 54px rgba(232,185,49,0.16), inset 0 0 44px rgba(0,212,170,0.04)",
              maxHeight: "min(640px, calc(100dvh - 7rem))",
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div
              className="relative flex items-center gap-3 px-4 py-4 sm:px-5"
              style={{
                background:
                  "linear-gradient(115deg, rgba(27, 74, 51, 0.98), rgba(10, 35, 23, 0.98))",
                borderBottom: "1px solid rgba(232, 185, 49, 0.32)",
              }}
            >
              <div
                className="relative h-14 w-14 shrink-0 rounded-full p-[2px]"
                style={{
                  background:
                    "conic-gradient(from 45deg, #00D4AA, #E8B931, #174d35, #00D4AA)",
                  boxShadow:
                    "0 0 24px rgba(0, 212, 170, 0.25), 0 0 34px rgba(232, 185, 49, 0.14)",
                }}
              >
                <span className="block h-full w-full overflow-hidden rounded-full bg-[#081a11] p-[2px]">
                  <img
                    src={HK_AVATAR}
                    alt="H.K."
                    className="h-full w-full rounded-full object-cover"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2"
                  style={{ background: "#22c55e", borderColor: "#0b2418" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="mb-1 truncate text-[9px] font-mono uppercase tracking-[0.18em]"
                  style={{ color: "#00D4AA" }}
                >
                  TechBridge // Active system
                </p>
                <h3
                  className="font-display text-base font-bold leading-none sm:text-lg"
                  style={{ color: "#FDF8F0" }}
                >
                  H.K. <span className="text-glow-gold">Triage</span>
                </h3>
                <p
                  className="mt-1.5 truncate text-[11px]"
                  style={{ color: "rgba(253, 248, 240, 0.68)" }}
                >
                  Help Desk Architect · deterministic · human-backed
                </p>
              </div>
              <button
                type="button"
                onClick={toggleChat}
                aria-label="Close H.K. triage"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105"
                style={{
                  color: "#E8B931",
                  background: "rgba(7, 23, 15, 0.72)",
                  border: "1px solid rgba(232, 185, 49, 0.42)",
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
              style={{ minHeight: "180px", maxHeight: "min(360px, 42vh)" }}
            >
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "hk" && (
                    <div
                      className="w-7 h-7 rounded-full overflow-hidden shrink-0 mr-2 mt-1"
                      style={{ border: "1.5px solid rgba(201, 162, 39, 0.4)" }}
                    >
                      <img
                        src={HK_AVATAR}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="max-w-[85%]">
                    <div
                      className="rounded-2xl px-4 py-3 text-sm whitespace-pre-line"
                      style={
                        msg.role === "hk"
                          ? {
                              background: "rgba(28, 86, 59, 0.72)",
                              color: "#FDF8F0",
                              borderBottomLeftRadius: "4px",
                              border: "1px solid rgba(0, 212, 170, 0.28)",
                            }
                          : {
                              background: "rgba(116, 86, 19, 0.58)",
                              color: "#FDF8F0",
                              borderBottomRightRadius: "4px",
                              border: "1px solid rgba(232, 185, 49, 0.4)",
                            }
                      }
                    >
                      {msg.text}
                    </div>
                    {msg.triage && <PriorityBadge triage={msg.triage} />}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-7 h-7 rounded-full overflow-hidden shrink-0"
                    style={{ border: "1.5px solid rgba(201, 162, 39, 0.4)" }}
                  >
                    <img
                      src={HK_AVATAR}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="flex gap-1 px-4 py-3 rounded-2xl"
                    style={{ background: "rgba(28, 86, 59, 0.68)" }}
                  >
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#C9A227" }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (show when few messages) */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p
                  className="text-xs font-mono mb-2"
                  style={{ color: "rgba(253, 248, 240, 0.68)" }}
                >
                  Quick starts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACTIONS.map(action => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.query)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                      style={{
                        background: "rgba(232, 185, 49, 0.15)",
                        color: "#F2CF62",
                        border: "1px solid rgba(232, 185, 49, 0.34)",
                      }}
                    >
                      {action.emoji} {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Safety notice */}
            <div
              className="px-4 py-2"
              style={{ background: "rgba(18, 63, 43, 0.66)" }}
            >
              <p
                className="text-xs"
                style={{ color: "rgba(253, 248, 240, 0.7)" }}
              >
                🔒 <strong>Privacy boundary:</strong> H.K. triage stays in this
                interface. Never enter passwords, SSNs, bank information,
                medical details, or verification codes.
              </p>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderTop: "1px solid rgba(232, 185, 49, 0.28)" }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onFocus={() => tbSoundEngine.play("form_focus")}
                placeholder="Describe the issue, not your secrets…"
                autoComplete="off"
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(3, 15, 9, 0.72)",
                  color: "#FDF8F0",
                  border: "1px solid rgba(232, 185, 49, 0.34)",
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send issue to H.K. triage"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30"
                style={{ background: "#C9A227", color: "#1B4332" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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

            {/* Footer */}
            <div
              className="px-4 py-2 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(201, 162, 39, 0.08)" }}
            >
              <p
                className="text-xs italic"
                style={{ color: "rgba(253, 248, 240, 0.52)" }}
              >
                Named for Horace King, bridge builder
              </p>
              <a
                href="/get-help"
                className="text-xs font-medium transition-colors hover:underline"
                style={{ color: "#C9A227" }}
              >
                I need in-person help →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
