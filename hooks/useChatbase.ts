"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window { chatbase?: any; }
}

function rawCall(method: string, ...args: any[]) {
  try {
    const cb = window.chatbase;
    if (!cb) return;
    if (typeof cb[method] === "function") return cb[method](...args);
    if (typeof cb === "function") return cb(method, ...args);
  } catch {}
}

/**
 * Polls until the Chatbase widget reaches "initialized" state, then
 * exposes stable `open` and `sendMessage` callbacks.
 *
 * Buttons rendered from this hook are disabled until ready — no more
 * silent failures from calling the API before the widget loads.
 */
export function useChatbase() {
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function poll() {
      try {
        if (
          window.chatbase &&
          typeof window.chatbase === "function" &&
          window.chatbase("getState") === "initialized"
        ) {
          setReady(true);
          return;
        }
      } catch {}
      timer.current = setTimeout(poll, 500);
    }
    poll();
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  const open = useCallback(() => rawCall("open"), []);

  const sendMessage = useCallback((msg: string) => {
    rawCall("open");
    setTimeout(() => rawCall("sendMessage", msg), 650);
  }, []);

  return { ready, open, sendMessage };
}
