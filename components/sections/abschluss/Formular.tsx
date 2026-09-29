"use client";

/*
 * Formular „KI-Workshop sichern“ in drei Schritten. Es fängt beim Problem an
 * (Zeitfresser + Stunden), erst am Ende kommen Name und Kontakt.
 *
 * Versand über /api/anfrage. Ohne Resend-Schlüssel antwortet die Route mit 503
 * („kein-versand“); dann öffnet sich das E-Mail-Programm mit fertigem Text.
 * Nie steht eine Erfolgsmeldung, hinter der kein Versand steckt.
 *
 * Im Server-HTML steht Schritt 1 vollständig sichtbar. Bewegung nur im Browser,
 * bei reduzierter Bewegung ohne Gleiten und ohne Zählen.
 */

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { abschluss, ergebnisse } from "@/app/copy";
import { company } from "@/app/content";
import { EMAIL, GROESSEN, STUNDEN, ZEITFRESSER, mailtoAdresse, type Anfrage } from "@/app/api/anfrage/format";
import { Arrow, Mail, Phone } from "@/components/system/Icons";
import { useMotionMode } from "@/lib/hooks";
import AutoHeight from "./AutoHeight";
import Zahl from "./Zahl";
import { Haken, Hinweis, Leute, Zeitfresser, Zurueck } from "./Symbole";

const EASE = [0.22, 1, 0.36, 1] as const;
const { step1, step2, step3, errors: E } = abschluss;

type Key = "tasks" | "employees" | "name" | "company" | "email" | "consent";
type Status = "idle" | "sending" | "done" | "fallback" | "failure";
type Texte = { industry: string; name: string; company: string; email: string; phone: string; message: string; website: string };

const STEP_KEYS: Key[][] = [["tasks"], ["employees"], ["name", "company", "email", "consent"]];
const FELD_ID: Record<Key, string> = {
  tasks: "frm-task-0",
  employees: "frm-size-0",
  name: "frm-name",
  company: "frm-company",
  email: "frm-email",
  consent: "frm-consent",
};
const STEP_OF: Record<Key, number> = { tasks: 0, employees: 1, name: 2, company: 2, email: 2, consent: 2 };

/** Vorname für die Erfolgsmeldung (Titel wie „Dr.“ oder „Herr“ überspringen). */
function vorname(name: string): string {
  const teile = name.trim().split(/\s+/).filter((t) => !/\.$/.test(t) && !/^(herr|frau)$/i.test(t));
  return teile[0] ?? "";
}

/** Zum Element scrollen, falls es nicht gut im Bild ist (Lenis, sonst nativ). */
function insBild(el: Element | null, reduced: boolean, oben = 104) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  if (r.top >= oben && r.top <= vh * 0.6) return;
  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -oben, duration: reduced ? 0 : 0.9 });
  else window.scrollTo({ top: window.scrollY + r.top - oben, behavior: reduced ? "auto" : "smooth" });
}

/** Schickt die Anfrage an /api/anfrage und übersetzt die Antwort in einen Zustand. */
async function senden(anfrage: Anfrage & { website: string }, reduced: boolean): Promise<{ ergebnis: Status; felder?: Key[] }> {
  const start = performance.now();
  let ergebnis: Status = "failure";
  let felder: Key[] | undefined;
  try {
    const antwort = await fetch("/api/anfrage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(anfrage),
    });
    if (antwort.ok) ergebnis = "done";
    else if (antwort.status === 503) ergebnis = "fallback";
    else if (antwort.status === 400) {
      const daten = (await antwort.json().catch(() => null)) as { felder?: string[] } | null;
      felder = (daten?.felder ?? []).filter((k): k is Key => k in FELD_ID);
      if (!felder.length) felder = undefined;
    }
  } catch {
    ergebnis = "failure";
  }
  // Kurzer Moment für den Ladezustand, damit nichts flackert
  const rest = 650 - (performance.now() - start);
  if (rest > 0 && !reduced && !felder) await new Promise((r) => setTimeout(r, rest));
  if (ergebnis === "done") window.dataLayer?.push({ event: "anfrage_gesendet", formular: "ki-workshop" });
  return { ergebnis, felder };
}

/** Öffnet das E-Mail-Programm mit der fertigen Nachricht (Rückweg ohne Resend-Schlüssel). */
function oeffneMailprogramm(href: string) {
  window.location.assign(href);
}

function Fehler({ id, children }: Readonly<{ id: string; children: string }>) {
  return (
    <motion.p
      className="frm-err"
      id={id}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <Hinweis />
      <span>{children}</span>
    </motion.p>
  );
}

export default function Formular() {
  const mode = useMotionMode();
  const reduced = mode === "reduced";

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [tasks, setTasks] = useState<string[]>([]);
  const [hours, setHours] = useState<number>(STUNDEN.start);
  const [employees, setEmployees] = useState("");
  const [t, setT] = useState<Texte>({ industry: "", name: "", company: "", email: "", phone: "", message: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [mailto, setMailto] = useState<string | null>(null);
  const [liveCalc, setLiveCalc] = useState("");

  const focusNext = useRef<"step" | "result" | null>(null);
  const stepRef = useRef(0);

  const { year, weeks } = step1.calc(hours);

  // Rechnung für Screenreader erst nach kurzer Ruhe ansagen (nicht bei jedem Reglerschritt)
  useEffect(() => {
    const id = window.setTimeout(
      () => setLiveCalc(`${step1.calcBefore}${year.toLocaleString("de-DE")}${step1.calcMid}${weeks}${step1.calcAfter}`),
      700,
    );
    return () => window.clearTimeout(id);
  }, [year, weeks]);

  /* Fokus nach Schrittwechsel bzw. Ergebnis: erst setzen, wenn das Ziel wirklich
     im DOM ist (AnimatePresence hängt es verzögert ein). Callback-Refs statt Timer. */
  const fokusTitel = (s: number) => (el: HTMLHeadingElement | null) => {
    if (!el || focusNext.current !== "step" || stepRef.current !== s) return;
    focusNext.current = null;
    requestAnimationFrame(() => {
      insBild(el.closest(".frm-card"), reduced);
      const fein = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const ziel = s === 2 && fein ? document.getElementById("frm-name") : el;
      ziel?.focus({ preventScroll: true });
    });
  };
  const fokusErgebnis = (el: HTMLHeadingElement | null) => {
    if (!el || focusNext.current !== "result") return;
    focusNext.current = null;
    requestAnimationFrame(() => {
      insBild(el.closest(".frm-card"), reduced);
      el.focus({ preventScroll: true });
    });
  };

  const werte = { tasks, employees, consent, ...t };

  function pruefe(k: Key, v = werte): string | undefined {
    switch (k) {
      case "tasks":
        return v.tasks.length ? undefined : E.tasks;
      case "employees":
        return v.employees ? undefined : E.size;
      case "name":
        return v.name.trim() ? undefined : E.name;
      case "company":
        return v.company.trim() ? undefined : E.company;
      case "email":
        if (!v.email.trim()) return E.email;
        return EMAIL.test(v.email.trim()) ? undefined : E.emailInvalid;
      case "consent":
        return v.consent ? undefined : E.consent;
    }
  }

  function setzeFehler(k: Key, msg: string | undefined) {
    setErrors((cur) => {
      if (cur[k] === msg) return cur;
      const next = { ...cur };
      if (msg) next[k] = msg;
      else delete next[k];
      return next;
    });
  }

  function fokusFeld(k: Key) {
    const el = document.getElementById(FELD_ID[k]);
    if (!el) return;
    insBild(el.closest(".frm-block") ?? el, reduced, 120);
    el.focus({ preventScroll: true });
  }

  /** Prüft einen Schritt; markiert Fehler und springt zum ersten. */
  function schrittOk(s: number): boolean {
    const keys = STEP_KEYS[s];
    let erster: Key | null = null;
    const next = { ...errors };
    for (const k of keys) {
      const m = pruefe(k);
      if (m) {
        next[k] = m;
        erster ??= k;
      } else delete next[k];
    }
    setErrors(next);
    setTouched((cur) => ({ ...cur, ...Object.fromEntries(keys.map((k) => [k, true])) }));
    if (erster) fokusFeld(erster);
    return !erster;
  }

  function gehe(to: number) {
    setDir(to > step ? 1 : -1);
    setStep(to);
    stepRef.current = to;
    focusNext.current = "step";
  }

  // Eingaben
  function toggleTask(tile: string) {
    const next = tasks.includes(tile) ? tasks.filter((x) => x !== tile) : [...tasks, tile];
    setTasks(next);
    if (touched.tasks) setzeFehler("tasks", pruefe("tasks", { ...werte, tasks: next }));
  }
  function waehleGroesse(s: string) {
    setEmployees(s);
    setzeFehler("employees", undefined);
  }
  function text(k: keyof Texte) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.target.value;
      setT((cur) => ({ ...cur, [k]: v }));
      if ((k === "name" || k === "company" || k === "email") && (touched[k] || errors[k])) {
        // Fehler verschwindet, sobald die Eingabe passt; neue Fehler erst beim Verlassen
        const m = pruefe(k, { ...werte, [k]: v });
        if (!m) setzeFehler(k, undefined);
        else if (errors[k]) setzeFehler(k, m);
      }
    };
  }
  function verlassen(k: Key) {
    return () => {
      const v = k === "email" ? t.email : k === "name" ? t.name : t.company;
      if (!v.trim() && !touched[k]) return; // leeres Feld beim ersten Durchtabben nicht anmeckern
      setTouched((cur) => ({ ...cur, [k]: true }));
      setzeFehler(k, pruefe(k));
    };
  }
  // Enter springt in einzeiligen Feldern von Schritt 3 zum nächsten Feld statt abzuschicken
  function weiterMitEnter(nextId: string) {
    return (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
      e.preventDefault();
      document.getElementById(nextId)?.focus();
    };
  }

  async function absenden(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    if (step < 2) {
      if (schrittOk(step)) gehe(step + 1);
      return;
    }
    if (!schrittOk(2)) return;
    // Sicherheitsnetz: frühere Schritte ebenfalls vollständig?
    for (const s of [0, 1]) {
      if (STEP_KEYS[s].some((k) => pruefe(k))) {
        gehe(s);
        return;
      }
    }

    const anfrage: Anfrage & { website: string } = {
      tasks,
      hours,
      employees,
      industry: t.industry.trim(),
      name: t.name.trim(),
      company: t.company.trim(),
      email: t.email.trim(),
      phone: t.phone.trim(),
      message: t.message.trim(),
      consent,
      website: t.website,
    };

    setStatus("sending");
    const { ergebnis, felder } = await senden(anfrage, reduced);

    if (felder?.length) {
      // Server meldet fehlende Angaben: zurück zum passenden Schritt
      const next: Partial<Record<Key, string>> = {};
      felder.forEach((k) => (next[k] = pruefe(k) ?? E[k === "employees" ? "size" : k === "email" ? "emailInvalid" : k]));
      setErrors(next);
      setStatus("idle");
      const s = Math.min(...felder.map((k) => STEP_OF[k]));
      if (s !== step) gehe(s);
      else fokusFeld(felder[0]);
      return;
    }
    if (ergebnis === "fallback") {
      const href = mailtoAdresse(anfrage, company.email);
      setMailto(href);
      oeffneMailprogramm(href);
    }
    focusNext.current = "result";
    setStatus(ergebnis);
  }

  const zurueckZumFormular = () => {
    setStatus("idle");
    setDir(-1);
    setStep(2);
    stepRef.current = 2;
    focusNext.current = "step";
  };

  const sending = status === "sending";
  const fertig = status === "done" || status === "fallback" || status === "failure";
  const p = (hours - STUNDEN.min) / (STUNDEN.max - STUNDEN.min);

  const slide = {
    enter: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, x: d * 44 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, x: d * -44 }),
  };
  const slideT = reduced ? { duration: 0 } : { duration: 0.45, ease: EASE };

  const aria = (k: Key, hint?: string) => ({
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `${FELD_ID[k]}-err` : hint,
  });

  return (
    <div className="frm-card">
      <AutoHeight instant={reduced}>
        <AnimatePresence mode="wait" initial={false}>
          {fertig ? (
            <motion.div
              key={status}
              className="frm-result"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div role="status" aria-live="polite">
                {status === "done" ? (
                  <>
                    <span className="frm-mark" aria-hidden="true">
                      <svg viewBox="0 0 64 64" width="64" height="64">
                        <g transform="rotate(-90 32 32)">
                          <motion.circle
                            cx="32"
                            cy="32"
                            r="30.5"
                            className="frm-mark-ring"
                            initial={reduced ? false : { pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                          />
                        </g>
                        <motion.path
                          d="M21 33.2 28.4 40.4 43.4 24.6"
                          className="frm-mark-tick"
                          initial={reduced ? false : { pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.45, delay: 0.6, ease: [0.65, 0, 0.35, 1] }}
                        />
                      </svg>
                    </span>
                    <h3 className="frm-result-title" tabIndex={-1} ref={fokusErgebnis}>
                      {abschluss.success(vorname(t.name))}
                    </h3>
                    <p className="frm-result-text">{abschluss.successText}</p>
                  </>
                ) : status === "fallback" ? (
                  <>
                    <span className="frm-mark frm-mark--icon" aria-hidden="true">
                      <Mail size={24} />
                    </span>
                    <h3 className="frm-result-title frm-result-title--sm" tabIndex={-1} ref={fokusErgebnis}>
                      {abschluss.fallback}
                    </h3>
                    <p className="frm-result-text">
                      <a className="frm-link" href={mailto ?? `mailto:${company.email}`}>
                        {company.email}
                      </a>
                    </p>
                  </>
                ) : (
                  <>
                    <span className="frm-mark frm-mark--icon" aria-hidden="true">
                      <Phone size={24} />
                    </span>
                    <h3 className="frm-result-title frm-result-title--sm" tabIndex={-1} ref={fokusErgebnis}>
                      {abschluss.errorBefore}
                      <a className="frm-link nb" href={`tel:${company.phoneHref}`}>
                        {company.phone}
                      </a>
                      {abschluss.errorMid}
                      <a className="frm-link" href={`mailto:${company.email}`}>
                        {company.email}
                      </a>
                      {abschluss.errorAfter}
                    </h3>
                  </>
                )}
              </div>
              {status !== "done" ? (
                <button type="button" className="frm-textbtn" onClick={zurueckZumFormular}>
                  <Zurueck />
                  {abschluss.back}
                </button>
              ) : null}
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="frm"
              noValidate
              onSubmit={absenden}
              aria-label={abschluss.submit}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.25 } }}
            >
              {/* Kopf: Zurück, Schritt x von 3, Fortschritt */}
              <div className="frm-top">
                <button
                  type="button"
                  className="frm-back"
                  onClick={() => gehe(step - 1)}
                  disabled={step === 0 || sending}
                  data-hidden={step === 0 ? "true" : "false"}
                  aria-hidden={step === 0 ? true : undefined}
                  tabIndex={step === 0 ? -1 : undefined}
                >
                  <Zurueck />
                  {abschluss.back}
                </button>
                <p className="frm-stepof" id="frm-stepof">
                  {abschluss.stepOf(step + 1)}
                </p>
              </div>
              <div
                className="frm-progress"
                role="progressbar"
                aria-labelledby="frm-stepof"
                aria-valuemin={1}
                aria-valuemax={3}
                aria-valuenow={step + 1}
              >
                {[0, 1, 2].map((i) => (
                  <span key={i} className="frm-seg">
                    <motion.span
                      className="frm-seg-fill"
                      initial={false}
                      animate={{ scaleX: i <= step ? 1 : 0 }}
                      transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: i === step ? 0.1 : 0 }}
                    />
                  </span>
                ))}
              </div>

              <AutoHeight instant={reduced} className="frm-viewport">
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                  <motion.div
                    key={step}
                    className="frm-step"
                    custom={dir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={slideT}
                  >
                    {step === 0 ? (
                      <>
                        <fieldset className="frm-fs frm-block" aria-describedby={errors.tasks ? "frm-task-0-err" : "frm-tasks-hint"}>
                          <legend className="frm-legend">
                            <h3 className="frm-title" tabIndex={-1} ref={fokusTitel(0)}>
                              {step1.title}
                            </h3>
                          </legend>
                          <p className="frm-hint" id="frm-tasks-hint">
                            {step1.hint}
                          </p>
                          <div className="frm-tiles">
                            {ZEITFRESSER.map((tile, i) => {
                              const on = tasks.includes(tile);
                              return (
                                <label key={tile} className="frm-tile" data-on={on ? "true" : "false"}>
                                  <input
                                    type="checkbox"
                                    className="frm-hidden"
                                    id={`frm-task-${i}`}
                                    name="tasks"
                                    value={tile}
                                    checked={on}
                                    onChange={() => toggleTask(tile)}
                                    aria-invalid={i === 0 && errors.tasks ? true : undefined}
                                  />
                                  <span className="frm-tile-ic">
                                    <Zeitfresser i={i} />
                                  </span>
                                  <span className="frm-tile-txt">
                                    <span className="frm-tick" aria-hidden="true">
                                      <Haken size={12} />
                                    </span>
                                    {tile}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                          {errors.tasks ? <Fehler id="frm-task-0-err">{errors.tasks}</Fehler> : null}
                        </fieldset>

                        <div className="frm-slider">
                          <label className="frm-q" htmlFor="frm-hours">
                            {step1.slider}
                          </label>
                          <p className="frm-hours" aria-hidden="true">
                            <span className="frm-hours-num tnum">{hours}</span>
                            <span className="frm-hours-unit">{step1.unit}</span>
                          </p>
                          <input
                            type="range"
                            id="frm-hours"
                            className="frm-range"
                            min={STUNDEN.min}
                            max={STUNDEN.max}
                            step={1}
                            value={hours}
                            onChange={(e) => setHours(Number(e.target.value))}
                            aria-valuetext={`${hours} ${step1.unit}`}
                            style={{ "--p": p } as React.CSSProperties}
                          />
                          <div className="frm-scale" aria-hidden="true">
                            <span>{STUNDEN.min}</span>
                            <span>{STUNDEN.max}</span>
                          </div>
                          <p className="frm-calc" aria-hidden="true">
                            {step1.calcBefore}
                            <strong>
                              <Zahl value={year} reduced={reduced} />
                            </strong>
                            {step1.calcMid}
                            <strong>
                              <Zahl value={weeks} reduced={reduced} />
                            </strong>
                            {step1.calcAfter}
                          </p>
                          <p className="sr-only" aria-live="polite">
                            {liveCalc}
                          </p>
                        </div>
                      </>
                    ) : step === 1 ? (
                      <>
                        <fieldset className="frm-fs frm-block" aria-describedby={errors.employees ? "frm-size-0-err" : undefined}>
                          <legend className="frm-legend">
                            <h3 className="frm-title" tabIndex={-1} ref={fokusTitel(1)}>
                              {step2.title}
                            </h3>
                          </legend>
                          <p className="frm-q" id="frm-size-q">
                            {step2.question}
                          </p>
                          <div className="frm-sizes" role="radiogroup" aria-labelledby="frm-size-q">
                            {GROESSEN.map((s, i) => {
                              const on = employees === s;
                              return (
                                <label key={s} className="frm-size" data-on={on ? "true" : "false"}>
                                  <input
                                    type="radio"
                                    className="frm-hidden"
                                    id={`frm-size-${i}`}
                                    name="employees"
                                    value={s}
                                    checked={on}
                                    onChange={() => waehleGroesse(s)}
                                    aria-invalid={i === 0 && errors.employees ? true : undefined}
                                  />
                                  <span className="frm-size-ic">
                                    <Leute n={i + 1} />
                                  </span>
                                  <span className="frm-size-txt">{s}</span>
                                  <span className="frm-tick" aria-hidden="true">
                                    <Haken size={12} />
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                          {errors.employees ? <Fehler id="frm-size-0-err">{errors.employees}</Fehler> : null}
                        </fieldset>
                        <div className="frm-field">
                          <label className="frm-label" htmlFor="frm-industry">
                            {step2.industry} <span className="frm-opt">{abschluss.optional}</span>
                          </label>
                          <input
                            id="frm-industry"
                            className="frm-input"
                            type="text"
                            name="industry"
                            autoComplete="off"
                            enterKeyHint="next"
                            value={t.industry}
                            onChange={text("industry")}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="frm-legend frm-legend--solo">
                          <h3 className="frm-title" tabIndex={-1} ref={fokusTitel(2)}>
                            {step3.title}
                          </h3>
                        </div>
                        <div className="frm-fields">
                          <div className="frm-field frm-block">
                            <label className="frm-label" htmlFor="frm-name">
                              {step3.name}
                            </label>
                            <input
                              id="frm-name"
                              className="frm-input"
                              type="text"
                              name="name"
                              autoComplete="name"
                              autoCapitalize="words"
                              enterKeyHint="next"
                              required
                              value={t.name}
                              onChange={text("name")}
                              onBlur={verlassen("name")}
                              onKeyDown={weiterMitEnter("frm-company")}
                              {...aria("name")}
                            />
                            {errors.name ? <Fehler id="frm-name-err">{errors.name}</Fehler> : null}
                          </div>
                          <div className="frm-field frm-block">
                            <label className="frm-label" htmlFor="frm-company">
                              {step3.company}
                            </label>
                            <input
                              id="frm-company"
                              className="frm-input"
                              type="text"
                              name="company"
                              autoComplete="organization"
                              enterKeyHint="next"
                              required
                              value={t.company}
                              onChange={text("company")}
                              onBlur={verlassen("company")}
                              onKeyDown={weiterMitEnter("frm-email")}
                              {...aria("company")}
                            />
                            {errors.company ? <Fehler id="frm-company-err">{errors.company}</Fehler> : null}
                          </div>
                          <div className="frm-field frm-block">
                            <label className="frm-label" htmlFor="frm-email">
                              {step3.email}
                            </label>
                            <input
                              id="frm-email"
                              className="frm-input"
                              type="email"
                              name="email"
                              inputMode="email"
                              autoComplete="email"
                              autoCapitalize="off"
                              autoCorrect="off"
                              spellCheck={false}
                              enterKeyHint="next"
                              required
                              value={t.email}
                              onChange={text("email")}
                              onBlur={verlassen("email")}
                              onKeyDown={weiterMitEnter("frm-phone")}
                              {...aria("email")}
                            />
                            {errors.email ? <Fehler id="frm-email-err">{errors.email}</Fehler> : null}
                          </div>
                          <div className="frm-field">
                            <label className="frm-label" htmlFor="frm-phone">
                              {step3.phone} <span className="frm-opt">{abschluss.optional}</span>
                            </label>
                            <input
                              id="frm-phone"
                              className="frm-input"
                              type="tel"
                              name="phone"
                              inputMode="tel"
                              autoComplete="tel"
                              enterKeyHint="next"
                              value={t.phone}
                              onChange={text("phone")}
                              onKeyDown={weiterMitEnter("frm-message")}
                            />
                          </div>
                          <div className="frm-field frm-field--wide">
                            <label className="frm-label" htmlFor="frm-message">
                              {step3.message} <span className="frm-opt">{abschluss.optional}</span>
                            </label>
                            <textarea
                              id="frm-message"
                              className="frm-input frm-textarea"
                              name="message"
                              rows={3}
                              data-lenis-prevent=""
                              value={t.message}
                              onChange={text("message")}
                            />
                          </div>
                        </div>

                        <div className="frm-block">
                          <label className="frm-consent" data-invalid={errors.consent ? "true" : "false"}>
                            <input
                              type="checkbox"
                              className="frm-hidden"
                              id="frm-consent"
                              name="consent"
                              checked={consent}
                              onChange={(e) => {
                                setConsent(e.target.checked);
                                if (e.target.checked) setzeFehler("consent", undefined);
                              }}
                              {...aria("consent")}
                            />
                            <span className="frm-check" aria-hidden="true">
                              <Haken size={13} />
                            </span>
                            <span className="frm-consent-txt">
                              {step3.consentBefore}
                              <Link href="/datenschutz" target="_blank" rel="noopener" className="frm-link">
                                {step3.consentLink}
                                <span className="sr-only"> ({ergebnisse.newWindow})</span>
                              </Link>
                              {step3.consentAfter}
                            </span>
                          </label>
                          {errors.consent ? <Fehler id="frm-consent-err">{errors.consent}</Fehler> : null}
                        </div>

                        {/* Falle für Programme, die jedes Feld ausfüllen: für Menschen unsichtbar und nicht erreichbar */}
                        <div className="frm-trap" aria-hidden="true">
                          <label htmlFor="frm-website">Webseite</label>
                          <input id="frm-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={t.website} onChange={text("website")} />
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </AutoHeight>

              <div className="frm-foot">
                <button type="submit" className="btn btn-primary frm-submit" disabled={sending} aria-busy={sending || undefined}>
                  <span>{step < 2 ? abschluss.next : sending ? abschluss.sending : abschluss.submit}</span>
                  {sending ? (
                    <span className="frm-spin" aria-hidden="true" />
                  ) : (
                    <span className="btn-arrow" aria-hidden="true">
                      <Arrow />
                      <Arrow />
                    </span>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </AutoHeight>
    </div>
  );
}
