"use client";

import { Button } from "@/components/ui";
import { useChatbase } from "@/hooks/useChatbase";

export default function HKOpenButton({ className }: { className?: string }) {
  const { ready, open } = useChatbase();
  return (
    <Button
      id="hk-open-btn"
      className={className}
      onClick={open}
      disabled={!ready}
      aria-label={ready ? "Open H.K. AI chat" : "H.K. AI is loading"}
      title={ready ? undefined : "H.K. is loading…"}
    >
      {ready ? "Ask H.K. AI" : "H.K. loading…"}
    </Button>
  );
}
