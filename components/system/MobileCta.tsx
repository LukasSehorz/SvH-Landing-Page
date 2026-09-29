"use client";

import { useEffect, useState } from "react";
import { cta } from "@/app/copy";
import Cta from "./Cta";

/**
 * Feste CTA-Leiste unten (mobil), ab dem zweiten Bildschirm. Sie weicht aus,
 * solange das Formular, die Fußzeile oder ein gleichlautender Knopf im Inhalt
 * sichtbar ist (Knöpfe markieren sich über data-cta-inline selbst).
 */
export default function MobileCta() {
  const [past, setPast] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target, e.isIntersecting));
        setBlocked(Array.from(seen.values()).some(Boolean));
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const watched = new Set<Element>();
    const scan = () => {
      document.querySelectorAll("#termin, footer, main [data-cta-inline], [data-hide-mobile-cta]").forEach((el) => {
        if (watched.has(el) || el.closest(".mcta")) return;
        watched.add(el);
        io.observe(el);
      });
    };
    scan();
    // Abschnitte, die später hydrieren oder nachladen, erfassen
    const mo = new MutationObserver(() => scan());
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  const show = past && !blocked;
  return (
    <div className="mcta" data-show={show ? "true" : "false"} aria-hidden={show ? undefined : true} inert={!show}>
      <Cta href="/#termin" inline={false}>
        {cta.main}
      </Cta>
    </div>
  );
}
