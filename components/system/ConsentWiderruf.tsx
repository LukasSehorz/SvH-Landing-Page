"use client";

import { useEffect, useState } from "react";

/** Widerruf in der Fußzeile: öffnet das Einwilligungsfeld erneut. */
export default function ConsentWiderruf({ label }: Readonly<{ label: string }>) {
  const [bereit, setBereit] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setBereit(typeof window.svhEinwilligungAendern === "function"));
    return () => cancelAnimationFrame(id);
  }, []);
  if (!bereit) return null;
  return (
    <button type="button" onClick={() => window.svhEinwilligungAendern?.()}>
      {label}
    </button>
  );
}
