"use client";
import { useEffect } from "react";

export default function ChatbaseWidgetLoader() {
  useEffect(() => {
    const BOT_ID = "3ylVDc3243y5659rIjvcd";
    if (document.getElementById(BOT_ID)) return;
    const s = document.createElement("script");
    s.src = "https://www.chatbase.co/embed.min.js";
    s.id = BOT_ID;
    s.setAttribute("domain", "www.chatbase.co");
    s.defer = true;
    document.body.appendChild(s);
  }, []);
  return null;
}
