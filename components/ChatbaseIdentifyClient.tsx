"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window { chatbase?: any; }
}

function cbCall(method: string, ...args: any[]) {
  try {
    if (!window.chatbase) return;
    if (typeof window.chatbase[method] === "function") return window.chatbase[method](...args);
    if (typeof window.chatbase === "function") return window.chatbase(method, ...args);
  } catch {}
}

/**
 * Fetches a signed Chatbase JWT from /api/chatbase-jwt (server-only) and
 * identifies the current user with the widget. Only runs when `enabled` is true.
 * The JWT secret NEVER leaves the server.
 */
export default function ChatbaseIdentifyClient({ enabled = true }: { enabled?: boolean }) {
  const done = useRef(false);

  useEffect(() => {
    if (!enabled || done.current) return;
    done.current = true;

    (async () => {
      try {
        const res = await fetch("/api/chatbase-jwt", {
          method:  "GET",
          credentials: "include",
          cache:   "no-store",
        });
        if (!res.ok) return;
        const { token } = (await res.json()) as { token?: string };
        if (!token) return;

        // Poll until widget is initialized before calling identify
        let attempts = 0;
        function tryIdentify() {
          try {
            if (
              window.chatbase &&
              typeof window.chatbase === "function" &&
              window.chatbase("getState") === "initialized"
            ) {
              cbCall("identify", { token });
              return;
            }
          } catch {}
          if (attempts++ < 30) setTimeout(tryIdentify, 600);
        }
        tryIdentify();
      } catch {}
    })();
  }, [enabled]);

  return null;
}
