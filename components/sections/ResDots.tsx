"use client";

import { useEffect, useState } from "react";

/** Punkte unter der wischbaren Ergebnis-Reihe (nur Handy sichtbar). */
export default function ResDots({ count }: Readonly<{ count: number }>) {
  const [page, setPage] = useState(0);
  useEffect(() => {
    const t = document.getElementById("res-track");
    if (!t) return;
    const cards = Array.from(t.children);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) setPage(cards.indexOf(e.target));
        }),
      { root: t, threshold: [0.6] },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);
  return (
    <div className="res-dots" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <i key={i} data-on={i === page ? "true" : "false"} />
      ))}
    </div>
  );
}
