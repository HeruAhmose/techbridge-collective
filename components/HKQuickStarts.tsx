"use client";

import { useChatbase } from "@/hooks/useChatbase";

const PROMPTS: Array<{ emoji: string; label: string; msg: string }> = [
  { emoji: "📧", label: "Recover my email",       msg: "I need help recovering my email account" },
  { emoji: "💼", label: "Apply for jobs online",  msg: "I need help applying for jobs online" },
  { emoji: "📱", label: "Set up my phone",        msg: "I need help setting up my phone" },
  { emoji: "📁", label: "Upload documents",       msg: "I need help uploading documents online" },
  { emoji: "🔑", label: "Reset a password",       msg: "I need help resetting a password safely" },
  { emoji: "🏥", label: "Set up telehealth",      msg: "I need help setting up a telehealth appointment" },
];

export default function HKQuickStarts() {
  const { ready, sendMessage } = useChatbase();

  return (
    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Quick start prompts for H.K. AI">
      {PROMPTS.map((p) => (
        <button
          key={p.label}
          type="button"
          disabled={!ready}
          aria-label={`Ask H.K.: ${p.msg}`}
          className="rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-semibold text-ink/70 transition hover:bg-linen hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => sendMessage(p.msg)}
        >
          {p.emoji} {p.label}
        </button>
      ))}
    </div>
  );
}
