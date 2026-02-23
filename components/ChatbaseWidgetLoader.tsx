"use client";

import Script from "next/script";

declare global {
  interface Window {
    chatbase?: any;
    __CHATBASE_BOT_ID__?: string;
  }
}

const BOT_ID = process.env.NEXT_PUBLIC_CHATBASE_BOT_ID || "3ylVDc3243y5659rIjvcd";

export default function ChatbaseWidgetLoader() {
  const script = `
(function () {
  var CHATBOT_ID = "${BOT_ID}";
  CHATBOT_ID = (window.__CHATBASE_BOT_ID__ || CHATBOT_ID);

  if (!window.chatbase || window.chatbase("getState") !== "initialized") {
    window.chatbase = (...args) => (window.chatbase.q = window.chatbase.q || []).push(args);
    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if (prop === "q") return target.q;
        return (...args) => target(prop, ...args);
      }
    });
  }

  function onLoad() {
    var s = document.createElement("script");
    s.src = "https://www.chatbase.co/embed.min.js";
    s.id = CHATBOT_ID;
    s.setAttribute("chatbotId", CHATBOT_ID);
    s.defer = true;
    document.head.appendChild(s);
  }

  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad);
})();`.trim();

  return <Script id="chatbase-loader" strategy="afterInteractive">{script}</Script>;
}
