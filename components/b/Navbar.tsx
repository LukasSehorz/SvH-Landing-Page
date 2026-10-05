"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cta, nav } from "@/app/copy";
import { navB, type NavLink } from "@/app/(b)/copy";
import Cta from "@/components/system/Cta";
import { Arrow, Caret } from "@/components/system/Icons";

/* Leiste für Variante B: aufgebaut auf der Leiste aus A (components/system/Navbar.tsx), gleiches
   Aussehen und Verhalten. Menü: Leistungen (aufklappbar), Vorteile, Kunden, Über uns (aufklappbar
   mit Aktuelles). Startseite von B liegt unter /b. */

const HOME = "/b";

// Abschnitt → Menüpunkt (Unterpunkte markieren ihren Oberpunkt als aktiv)
const ABSCHNITT_ZU_PUNKT = new Map<string, string>();
navB.links.forEach((l) => {
  ABSCHNITT_ZU_PUNKT.set(l.id, l.id);
  l.sub?.forEach((s) => ABSCHNITT_ZU_PUNKT.set(s.href.slice(1), l.id));
});

/** Aufklapper (Desktop): öffnet per Klick, Tastatur oder Zeiger. */
function Drop({
  link,
  pre,
  open,
  active,
  onOpen,
  onClose,
}: {
  link: NavLink & { sub: NonNullable<NavLink["sub"]> };
  pre: string;
  open: boolean;
  active: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const panelId = useId();
  const timer = useRef(0);
  const halten = () => window.clearTimeout(timer.current);
  return (
    <li
      className="nav-drop"
      data-drop={link.id}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        halten();
        onOpen();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        timer.current = window.setTimeout(onClose, 160);
      }}
    >
      <button
        type="button"
        className="nav-link"
        aria-expanded={open}
        aria-controls={panelId}
        data-active={active ? "true" : "false"}
        onClick={() => (open ? onClose() : onOpen())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            onOpen();
            requestAnimationFrame(() => document.getElementById(panelId)?.querySelector<HTMLElement>("a")?.focus());
          }
        }}
      >
        {link.label}
        <Caret className="nav-caret" />
      </button>
      <div
        id={panelId}
        className="nav-panel navb-panel"
        data-open={open ? "true" : "false"}
        inert={!open}
        onBlur={(e) => {
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) onClose();
        }}
      >
        <ul className="navb-sub">
          {link.sub.map((s) => (
            <li key={s.href}>
              <a className="navb-sub-link" href={`${pre}${s.href}`} onClick={onClose}>
                <span className="navb-sub-titel">{s.label}</span>
                <span className="navb-sub-text">{s.text}</span>
              </a>
            </li>
          ))}
        </ul>
        {link.foot ? (
          <div className="nav-panel-foot">
            <a href={`${pre}${link.foot.href}`} onClick={onClose}>
              {link.foot.label} <Arrow size={16} />
            </a>
          </div>
        ) : null}
      </div>
    </li>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === HOME;
  const pre = onHome ? "" : HOME;
  const [down, setDown] = useState(false); // scrollt gerade nach unten (jenseits des Starts)
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drop, setDrop] = useState<string | null>(null); // offener Aufklapper (Desktop)
  const [sheetSub, setSheetSub] = useState<string | null>(null); // offene Gruppe im Vollbild-Menü
  const burger = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetId = useId();

  // Ausblenden beim Runterscrollen, Einblenden beim Hochscrollen
  useEffect(() => {
    // erst im ersten Bild lesen: scrollY beim Einhängen erzwingt mitten in der Hydration ein Layout
    let lastY = -1;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (lastY < 0) lastY = y;
        setScrolled(y > 24);
        if (Math.abs(y - lastY) > 6) {
          setDown(y > lastY && y > 160);
          lastY = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Aktiver Abschnitt (Unterabschnitte zählen für ihren Menüpunkt)
  useEffect(() => {
    if (!onHome) return;
    const ids = Array.from(ABSCHNITT_ZU_PUNKT.keys());
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const current = ids.find((id) => seen.get(id));
        setActive(current ? (ABSCHNITT_ZU_PUNKT.get(current) ?? null) : null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [onHome]);

  // Formular im Bild: der Leisten-Knopf führt dorthin, wo man schon ist, also blendet er aus
  const [atForm, setAtForm] = useState(false);
  useEffect(() => {
    if (!onHome) return;
    let io: IntersectionObserver | null = null;
    const watch = () => {
      const el = document.getElementById("termin");
      if (!el) return false;
      io = new IntersectionObserver(([e]) => setAtForm(e.isIntersecting), { rootMargin: "-30% 0px -30% 0px" });
      io.observe(el);
      return true;
    };
    // Abschluss kann später hydrieren: kurz nachfassen
    const late = watch() ? 0 : window.setTimeout(watch, 1500);
    return () => {
      window.clearTimeout(late);
      io?.disconnect();
      setAtForm(false);
    };
  }, [onHome]);

  // Ab 900 px: Steht ein Knopf aus dem Inhalt oben im Fenster, faltet sich der Leisten-Knopf
  // weg wie am Formular (nie zwei gleiche Knöpfe übereinander). Beobachtet werden die oberen
  // 40 % (Vorlauf auch bei schnellem Scrollen), nach oben erweitert: beim Hochscrollen weicht
  // der Leisten-Knopf, bevor ein Sektionsknopf von oben ins Bild kommt; beim Runterscrollen
  // kehrt er erst zurück, wenn der Sektionsknopf oben aus dem Bild ist.
  const [ctaOben, setCtaOben] = useState(false);
  useEffect(() => {
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target, e.isIntersecting));
        setCtaOben(Array.from(seen.values()).some(Boolean));
      },
      { rootMargin: "25% 0px -60% 0px" },
    );
    const scan = () =>
      document.querySelectorAll("main [data-cta-inline]").forEach((el) => {
        if (seen.has(el)) return;
        seen.set(el, false);
        io.observe(el);
      });
    // später hydrierte Sektionen (Schalter, Formular) nachfassen
    scan();
    const t1 = window.setTimeout(scan, 1500);
    const t2 = window.setTimeout(scan, 4000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      io.disconnect();
      setCtaOben(false);
    };
  }, [pathname]);

  // Aufklapper schließen: Escape, Klick daneben
  useEffect(() => {
    if (!drop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      document.querySelector<HTMLElement>(`[data-drop="${drop}"] > button`)?.focus();
      setDrop(null);
    };
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.(`[data-drop="${drop}"]`)) setDrop(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [drop]);

  // Vollbild-Menü: Scrollen sperren, Escape, Fokus
  const closeSheet = useCallback((returnFocus = true) => {
    setSheetOpen(false);
    if (returnFocus) requestAnimationFrame(() => burger.current?.focus());
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (!sheetOpen) {
      html.removeAttribute("data-menu-open");
      window.__lenis?.start();
      return;
    }
    html.setAttribute("data-menu-open", "");
    window.__lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => sheetRef.current?.querySelector<HTMLElement>("a,button")?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
      if (e.key === "Tab" && sheetRef.current) {
        // Fokus im Menü halten (Leiste mit Knopf gehört dazu)
        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>(".nav-bar a, .nav-bar button, .nav-sheet a, .nav-sheet button"),
        ).filter((n) => n.offsetParent !== null);
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [sheetOpen, closeSheet]);

  // Menü bei Seitenwechsel schließen (Vergleich im Render statt Effekt)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setSheetOpen(false);
    setDrop(null);
  }

  // Handy (< 900 px): Leiste blendet beim Runterscrollen aus, die CTA-Leiste unten übernimmt.
  // Ab 900 px verschwindet der Knopf nie: die Leiste schrumpft zur kompakten Pille.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const set = () => setWide(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  const menuActive = sheetOpen || drop !== null;
  const hidden = !wide && down && !menuActive;
  const compact = wide && down && !menuActive;
  const showBar = !hidden;
  // Leisten-Knopf eingeklappt: Formular im Bild oder (ab 900 px) ein Sektionsknopf oben
  const btnWeicht = (atForm || (wide && ctaOben)) && !sheetOpen;

  // B hat keine CTA-Leiste unten: die Leiste zeigt ihren Knopf auch mobil
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-nav-cta", "");
    return () => html.removeAttribute("data-nav-cta");
  }, []);

  // Zustand der Leiste für mitlaufende Elemente (z. B. Schalter-Band) bereitstellen
  useEffect(() => {
    const html = document.documentElement;
    if (showBar) html.removeAttribute("data-nav-hidden");
    else html.setAttribute("data-nav-hidden", "");
  }, [showBar]);

  return (
    <>
      <header
        className="nav"
        data-hidden={hidden ? "true" : "false"}
        data-compact={compact ? "true" : "false"}
        data-scrolled={scrolled ? "true" : "false"}
        data-at-form={btnWeicht ? "true" : "false"}
      >
        <nav className="nav-bar" aria-label="Hauptmenü">
          <Link href={HOME} className="nav-mark" aria-label={nav.home}>
            <Image className="wort" src="/logo/svh-wort-96.webp" alt="" width={169} height={22} loading="eager" />
            <Image className="mono" src="/logo/svh-bild-160.webp" alt="" width={18} height={30} loading="eager" unoptimized />
          </Link>

          <ul className="nav-links">
            {navB.links.map((l) =>
              l.sub ? (
                <Drop
                  key={l.id}
                  link={{ ...l, sub: l.sub }}
                  pre={pre}
                  open={drop === l.id}
                  active={active === l.id}
                  onOpen={() => setDrop(l.id)}
                  onClose={() => setDrop((d) => (d === l.id ? null : d))}
                />
              ) : (
                <li key={l.id}>
                  <Link className="nav-link" href={`${pre}${l.href}`} data-active={active === l.id ? "true" : "false"} aria-current={active === l.id ? "location" : undefined}>
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="nav-end">
            <Cta href={`${pre}#termin`} size="sm" inline={false} onClick={() => closeSheet(false)}>
              {/* ab 900 px derselbe Wortlaut wie in den Sektionen, darunter die kurze Fassung */}
              <span className="nav-cta-lang">{cta.main}</span>
              <span className="nav-cta-kurz">{cta.nav}</span>
            </Cta>
            <button
              ref={burger}
              type="button"
              className="nav-burger"
              aria-expanded={sheetOpen}
              aria-controls={sheetId}
              aria-label={sheetOpen ? nav.menuClose : nav.menuOpen}
              onClick={() => setSheetOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      <div
        id={sheetId}
        ref={sheetRef}
        className="nav-sheet"
        data-open={sheetOpen ? "true" : "false"}
        data-lenis-prevent=""
        inert={!sheetOpen}
        aria-hidden={!sheetOpen}
      >
        <nav aria-label="Menü">
          <ul className="nav-sheet-list">
            {navB.links.map((l, i) => (
              <li key={l.id} style={{ "--i": i } as React.CSSProperties}>
                {l.sub ? (
                  <>
                    <button
                      type="button"
                      className="nav-sheet-link"
                      aria-expanded={sheetSub === l.id}
                      aria-controls={`${sheetId}-${l.id}`}
                      onClick={() => setSheetSub((s) => (s === l.id ? null : l.id))}
                    >
                      {l.label}
                      <Caret />
                    </button>
                    <div className="nav-sheet-sub" id={`${sheetId}-${l.id}`} data-open={sheetSub === l.id ? "true" : "false"} inert={sheetSub !== l.id}>
                      <div className="nav-sheet-sub-inner">
                        {l.sub.map((s) => (
                          <a key={s.href} className="navb-sheet-sub-link" href={`${pre}${s.href}`} onClick={() => closeSheet(false)}>
                            <span className="navb-sub-titel">{s.label}</span>
                            <span className="navb-sub-text">{s.text}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link className="nav-sheet-link" href={`${pre}${l.href}`} onClick={() => closeSheet(false)}>
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-sheet-cta">
          <Cta href={`${pre}#termin`} inline={false} onClick={() => closeSheet(false)}>
            {cta.main}
          </Cta>
        </div>
      </div>
    </>
  );
}
