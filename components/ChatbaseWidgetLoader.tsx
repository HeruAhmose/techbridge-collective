"use client";
import Script from "next/script";

const BOT_ID = process.env.NEXT_PUBLIC_CHATBASE_BOT_ID || "3ylVDc3243y5659rIjvcd";

const script = `(function(){var id="${BOT_ID}";if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...a)=>(window.chatbase.q=window.chatbase.q||[]).push(a);window.chatbase=new Proxy(window.chatbase,{get(t,p){if(p==="q")return t.q;return(...a)=>t(p,...a)}});}function onLoad(){var s=document.createElement("script");s.src="https://www.chatbase.co/embed.min.js";s.id=id;s.setAttribute("chatbotId",id);s.defer=true;document.head.appendChild(s);}if(document.readyState==="complete")onLoad();else window.addEventListener("load",onLoad);})();`;

export default function ChatbaseWidgetLoader() {
  return (
    <Script
      id="chatbase-loader"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
