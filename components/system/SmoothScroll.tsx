"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { revealWithin } from "@/lib/reveal";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Abstand, damit Abschnittsköpfe nicht unter der Leiste liegen. */
function offsetFor(el: HTMLElement): number {
  return el.id === "termin" ? -12 : -8;
}

/**
 * Weiches Scrollen mit Lenis, gekoppelt an GSAP ScrollTrigger (wie alte Seite).
 * Bei prefers-reduced-motion bleibt das native Scrollen unangetastet.
 * Anker-Klicks (#termin, /#fahrplan) gleiten auf der Startseite weich zum Ziel.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | undefined;
    let tick: ((t: number) => void) | undefined;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1.1, touchMultiplier: 1.4, smoothWheel: true });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const m = href.match(/^\/?#([\w-]+)$/);
      if (!m) return;
      if (href.startsWith("/") && window.location.pathname !== "/") return; // Next navigiert zur Startseite
      const target = document.getElementById(m[1]);
      if (!target) return;
      e.preventDefault();
      history.replaceState(null, "", `#${m[1]}`);
      // Am Ziel eines Knopfes wird nichts eingeblendet: alles sofort sichtbar
      revealWithin(target);
      if (lenis) {
        // Sektionen, die ihre Pins erst in der Nähe aufbauen, verschieben das Ziel
        // während der Fahrt; deshalb nach Ankunft prüfen und bis zu dreimal nachführen
        let tries = 0;
        const arrive = () => {
          revealWithin(target);
          ScrollTrigger.update();
          const off = target.getBoundingClientRect().top + offsetFor(target);
          if (Math.abs(off) > 4 && tries++ < 3) lenis!.scrollTo(target, { offset: offsetFor(target), duration: 0.5, onComplete: arrive });
        };
        lenis.scrollTo(target, { offset: offsetFor(target), duration: 1.2, onComplete: arrive });
      } else {
        target.scrollIntoView({ block: "start" });
        ScrollTrigger.update();
      }
      // Fokus für Tastatur und Screenreader ans Ziel
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    // Beim Laden mit Hash (Direktaufruf oder von einer Unterseite kommend) sauber anspringen.
    // Sektionen bauen ihre Szenen erst in der Nähe auf und verschieben dabei die Seite.
    // Deshalb nachführen, bis die Seite stillsteht: bei jeder Größenänderung und jedem
    // ScrollTrigger-Neuberechnen neu ausrichten, fertig nach 1 s Ruhe, spätestens nach 4 s.
    let onRefresh: (() => void) | undefined;
    let ro: ResizeObserver | undefined;
    let settle = 0;
    let stopTimer = 0;
    const hashId = window.location.hash.slice(1);
    if (hashId && document.getElementById(hashId)) {
      const jump = () => {
        const t = document.getElementById(hashId);
        if (!t) return;
        revealWithin(t);
        if (lenis) lenis.scrollTo(t, { offset: offsetFor(t), immediate: true, force: true });
        else window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY + offsetFor(t));
        ScrollTrigger.update();
      };
      const stop = () => {
        ro?.disconnect();
        ro = undefined;
        if (onRefresh) ScrollTrigger.removeEventListener("refresh", onRefresh);
        onRefresh = undefined;
        window.clearTimeout(settle);
      };
      const nudge = () => {
        jump();
        window.clearTimeout(settle);
        settle = window.setTimeout(stop, 1000);
      };
      onRefresh = nudge;
      ScrollTrigger.addEventListener("refresh", onRefresh);
      ro = new ResizeObserver(() => nudge());
      ro.observe(document.body);
      // Nutzer-Eingabe hat Vorrang: wer selbst scrollt, wird nicht mehr zurückgeholt
      const userInput = () => stop();
      window.addEventListener("wheel", userInput, { once: true, passive: true });
      window.addEventListener("touchstart", userInput, { once: true, passive: true });
      window.addEventListener("keydown", userInput, { once: true });
      requestAnimationFrame(nudge);
      stopTimer = window.setTimeout(stop, 4000);
    } else {
      // Seitenwechsel ohne Anker: sofort oben beginnen (kein Gleiten)
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true, force: true });
    }

    return () => {
      if (onRefresh) ScrollTrigger.removeEventListener("refresh", onRefresh);
      ro?.disconnect();
      window.clearTimeout(settle);
      window.clearTimeout(stopTimer);
      document.removeEventListener("click", onClick);
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, [pathname]);

  return null;
}
