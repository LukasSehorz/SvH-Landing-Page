"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

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
      if (lenis) lenis.scrollTo(target, { offset: offsetFor(target), duration: 1.4 });
      else target.scrollIntoView({ block: "start" });
      // Fokus für Tastatur und Screenreader ans Ziel
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    // Beim Laden mit Hash (von Unterseite kommend) sauber anspringen. Gepinnte
    // Szenen entstehen erst nach dem Laden und verschieben alles darunter,
    // deshalb nach jedem Neuberechnen der ScrollTrigger in den ersten Sekunden nachführen.
    let onRefresh: (() => void) | undefined;
    const hashId = window.location.hash.slice(1);
    if (hashId && document.getElementById(hashId)) {
      const jump = () => {
        const t = document.getElementById(hashId);
        if (!t) return;
        if (lenis) lenis.scrollTo(t, { offset: offsetFor(t), immediate: true, force: true });
        else window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY + offsetFor(t));
      };
      const until = performance.now() + 2500;
      onRefresh = () => {
        if (performance.now() < until) jump();
      };
      ScrollTrigger.addEventListener("refresh", onRefresh);
      requestAnimationFrame(jump);
      window.setTimeout(jump, 600);
    }

    return () => {
      if (onRefresh) ScrollTrigger.removeEventListener("refresh", onRefresh);
      document.removeEventListener("click", onClick);
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, [pathname]);

  return null;
}
