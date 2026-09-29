"use client";

import { useEffect, useState } from "react";

type Item = { id: string; num?: string; title: string };

/**
 * Inhaltsverzeichnis der Rechtsseiten (breite Bildschirme, klebt links mit).
 * Markiert den Abschnitt, der gerade gelesen wird. Ohne JavaScript bleibt es
 * eine normale Linkliste.
 */
export default function LegalToc({ items, label }: Readonly<{ items: Item[]; label: string }>) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const current = items.find((i) => seen.get(i.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-18% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="lg-toc" aria-label={label}>
      <p className="lg-toc-title">{label}</p>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} data-active={active === i.id ? "true" : undefined} aria-current={active === i.id ? "location" : undefined}>
              {i.num ? <span className="lg-toc-num">{i.num}</span> : null}
              <span>{i.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
