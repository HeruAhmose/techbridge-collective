"use client";
import { useEffect } from "react";

const BOT_ID = "3ylVDc3243y5659rIjvcd";

export default function ChatbaseWidgetLoader() {
  useEffect(() => {
    if (document.getElementById(BOT_ID)) return;

    // Init stub
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      (window as any).chatbase = (...args: any[]) => {
        ((window as any).chatbase.q = (window as any).chatbase.q || []).push(args);
      };
    }

    // Load embed script
    const s = document.createElement("script");
    s.src = "https://www.chatbase.co/embed.min.js";
    s.id = BOT_ID;
    s.setAttribute("domain", "www.chatbase.co");
    s.defer = true;
    document.body.appendChild(s);
  }, []);

  return null;
}
