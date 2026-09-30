"use client";

import { useEffect, useState } from "react";
import { cta } from "@/app/copy";
import Cta from "./Cta";

/**
 * Feste CTA-Leiste unten (Handy), ab dem zweiten Bildschirm. Ein Ziel, ein Knopf:
 * Sie weicht aus, solange das Formular, die Fußzeile oder ein gleichlautender Knopf
 * im Inhalt sichtbar ist (Knöpfe markieren sich über data-cta-inline selbst,
 * Sektionen über data-hide-mobile-cta).
 * Sie setzt außerdem am <html>:
 *   data-mcta-show  solange die Leiste sichtbar ist
 *   data-nav-cta    wenn gerade gar kein Knopf sichtbar ist: dann darf der Knopf
 *                   der oberen Leiste erscheinen (sonst ist er auf dem Handy aus)
 */
export default function MobileCta() {
  const [past, setPast] = useState(false);
  const [inline, setInline] = useState(false);
  const [form, setForm] = useState(false);
  const [foot, setFoot] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const seenInline = new Map<Element, boolean>();
    const seenForm = new Map<Element, boolean>();
    const seenFoot = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const t = e.target as HTMLElement;
          if (t.hasAttribute("data-cta-inline")) seenInline.set(t, e.isIntersecting);
          else if (t.tagName === "FOOTER") seenFoot.set(t, e.isIntersecting);
          else seenForm.set(t, e.isIntersecting);
        });
        const any = (m: Map<Element, boolean>) => Array.from(m.values()).some(Boolean);
        setInline(any(seenInline));
        setForm(any(seenForm));
        setFoot(any(seenFoot));
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const watched = new Set<Element>();
    const scan = () => {
      document.querySelectorAll("#termin, footer, [data-hide-mobile-cta], main [data-cta-inline]").forEach((el) => {
        if (watched.has(el) || el.closest(".mcta")) return;
        watched.add(el);
        io.observe(el);
      });
    };
    // Einmal nach dem Aufbau und einmal nach dem Nachladen später hydrierter Sektionen
    scan();
    const late = window.setTimeout(scan, 1500);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(late);
      io.disconnect();
    };
  }, []);

  const show = past && !inline && !form && !foot;
  // Knopf der oberen Leiste nur, wenn sonst gar keiner sichtbar ist (z. B. über der Fußzeile)
  const navCta = !show && !inline && !form;

  useEffect(() => {
    const html = document.documentElement;
    html.toggleAttribute("data-mcta-show", show);
    html.toggleAttribute("data-nav-cta", navCta);
    return () => {
      html.removeAttribute("data-mcta-show");
      html.removeAttribute("data-nav-cta");
    };
  }, [show, navCta]);

  return (
    <div className="mcta" data-show={show ? "true" : "false"} aria-hidden={show ? undefined : true} inert={!show}>
      <Cta href="/#termin" inline={false}>
        {cta.main}
      </Cta>
    </div>
  );
}
