"use client";
import { useEffect } from "react";

export default function ChatbaseWidgetLoader() {
  useEffect(() => {
    if (document.getElementById("chatbase-loader")) return;
    const s = document.createElement("script");
    s.id = "chatbase-loader";
    s.innerHTML = `(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const el=document.createElement("script");el.src="https://www.chatbase.co/embed.min.js";el.id="3ylVDc3243y5659rIjvcd";el.domain="www.chatbase.co";document.body.appendChild(el)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`;
    document.head.appendChild(s);
  }, []);
  return null;
}
