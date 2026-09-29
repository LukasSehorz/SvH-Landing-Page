"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { aktuelles, cta, nav } from "@/app/copy";
import { company } from "@/app/content";
import Cta from "./Cta";
import { ArrowOut, Caret, Arrow } from "./Icons";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIDEOS = aktuelles.videos.slice(0, 3);

function VideoRow({ v, onPick }: { v: (typeof VIDEOS)[number]; onPick?: () => void }) {
  return (
    <a className="nav-video" href={v.href} target="_blank" rel="noopener noreferrer" onClick={onPick}>
      <span className="nav-video-thumb">
        <Image src={v.bild} alt="" width={264} height={148} sizes="132px" />
      </span>
      <span>
        <span className="nav-video-title">{v.titel}</span>
        <span className="nav-video-date">
          <time dateTime={v.datumIso}>{v.datum}</time>
        </span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const pre = onHome ? "" : "/";
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [dropOpen, setDropOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSub, setSheetSub] = useState(false);
  const dropRef = useRef<HTMLLIElement>(null);
  const dropBtn = useRef<HTMLButtonElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const openedByKey = useRef(false);
  const panelId = useId();
  const sheetId = useId();

  // Ausblenden beim Runterscrollen, Einblenden beim Hochscrollen
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setScrolled(y > 24);
        if (Math.abs(y - lastY) > 6) {
          setHidden(y > lastY && y > 160);
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

  // Aktiver Abschnitt
  useEffect(() => {
    if (!onHome) return;
    const ids = nav.links.map((l) => l.id);
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const current = ids.find((id) => seen.get(id)) ?? null;
        setActive(current);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [onHome]);

  // Aufklapper schließen: Escape, Klick daneben
  useEffect(() => {
    if (!dropOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropOpen(false);
        dropBtn.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!dropRef.current?.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    if (openedByKey.current) {
      requestAnimationFrame(() => dropRef.current?.querySelector<HTMLElement>(".nav-panel a")?.focus());
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [dropOpen]);

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

  // Menü bei Seitenwechsel schließen
  useEffect(() => {
    setSheetOpen(false);
    setDropOpen(false);
  }, [pathname]);

  const showBar = !hidden || sheetOpen || dropOpen;

  return (
    <>
      <header className="nav" data-hidden={showBar ? "false" : "true"} data-scrolled={scrolled ? "true" : "false"}>
        <nav className="nav-bar" aria-label="Hauptmenü">
          <Link href="/" className="nav-mark" aria-label={nav.home}>
            <Image className="wort" src="/logo/svh-wort-96.webp" alt="" width={169} height={22} priority />
            <Image className="mono" src="/logo/svh-bild-160.webp" alt="" width={18} height={30} priority />
          </Link>

          <ul className="nav-links">
            {nav.links.map((l) => (
              <li key={l.id}>
                <Link className="nav-link" href={`${pre}${l.href}`} data-active={active === l.id ? "true" : "false"} aria-current={active === l.id ? "location" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="nav-drop" ref={dropRef}>
              <button
                ref={dropBtn}
                type="button"
                className="nav-link"
                aria-expanded={dropOpen}
                aria-controls={panelId}
                data-active={pathname === "/aktuelles" ? "true" : "false"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") openedByKey.current = true;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setDropOpen(true);
                  }
                }}
                onClick={() => {
                  setDropOpen((o) => !o);
                  setTimeout(() => (openedByKey.current = false), 0);
                }}
              >
                {nav.aktuelles}
                <Caret className="nav-caret" />
              </button>
              <AnimatePresence>
                {dropOpen ? (
                  <motion.div
                    id={panelId}
                    className="nav-panel"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    onBlur={(e) => {
                      if (!dropRef.current?.contains(e.relatedTarget as Node)) setDropOpen(false);
                    }}
                  >
                    <p className="label nav-panel-title">{nav.panelTitle}</p>
                    <div>
                      {VIDEOS.map((v) => (
                        <VideoRow key={v.id} v={v} onPick={() => setDropOpen(false)} />
                      ))}
                    </div>
                    <div className="nav-panel-foot">
                      <Link href="/aktuelles" onClick={() => setDropOpen(false)}>
                        {nav.allVideos} <Arrow size={16} />
                      </Link>
                      <a href={company.youtube} target="_blank" rel="noopener noreferrer">
                        {nav.channel} <ArrowOut />
                      </a>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          </ul>

          <div className="nav-end">
            <Cta href={`${pre}#termin`} size="sm" onClick={() => closeSheet(false)}>
              {cta.nav}
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

      <AnimatePresence>
        {sheetOpen ? (
          <motion.div
            id={sheetId}
            ref={sheetRef}
            className="nav-sheet"
            data-lenis-prevent=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <nav aria-label="Menü">
              <ul className="nav-sheet-list">
                {nav.links.map((l, i) => (
                  <motion.li key={l.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: EASE }}>
                    <Link className="nav-sheet-link" href={`${pre}${l.href}`} onClick={() => closeSheet(false)}>
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5, ease: EASE }}>
                  <button type="button" className="nav-sheet-link" aria-expanded={sheetSub} onClick={() => setSheetSub((s) => !s)}>
                    {nav.aktuelles}
                    <Caret />
                  </button>
                  <AnimatePresence initial={false}>
                    {sheetSub ? (
                      <motion.div
                        className="nav-sheet-sub"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <div className="nav-sheet-sub-inner">
                          {VIDEOS.map((v) => (
                            <VideoRow key={v.id} v={v} />
                          ))}
                          <div className="nav-panel-foot">
                            <Link href="/aktuelles" onClick={() => closeSheet(false)}>
                              {nav.allVideos} <Arrow size={16} />
                            </Link>
                            <a href={company.youtube} target="_blank" rel="noopener noreferrer">
                              {nav.channel} <ArrowOut />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>
              </ul>
            </nav>
            <div className="nav-sheet-cta">
              <Cta href={`${pre}#termin`} onClick={() => closeSheet(false)}>
                {cta.main}
              </Cta>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
