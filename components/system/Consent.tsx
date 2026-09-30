"use client";

/*
 * Einwilligung und Nachladen des Google Tag Manager (funktional wie die alte Seite).
 * Beim ersten Aufruf steht der Consent Mode auf abgelehnt, bevor irgendetwas von
 * Google geladen wird. Erst „Einverstanden“ lädt gtm.js nach. „Nur das Nötige“
 * lädt nichts und speichert nur die Entscheidung im Browser.
 */

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { einwilligung } from "@/app/copy";
import { CONSENT_KEY, GTM_ID, type Einwilligung } from "@/app/tracking";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    svhEinwilligungAendern?: () => void;
  }
}

// Der Tag Manager erwartet das arguments-Objekt, kein Array
function gtag(...args: unknown[]) {
  void args;
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

function setzeConsent(stand: Einwilligung) {
  const v = stand === "alle" ? "granted" : "denied";
  gtag("consent", "update", { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
}

function ladeGtm() {
  if (document.getElementById("gtm-script")) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.id = "gtm-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

/* Die gemerkte Entscheidung als äußere Quelle (Browser-Ablage). Server: "server" = nichts zeigen. */
const EVENT = "svh-einwilligung";
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
function getSnapshot(): string {
  try {
    return window.localStorage.getItem(CONSENT_KEY) ?? "offen";
  } catch {
    return (window as unknown as { __svhWahl?: string }).__svhWahl ?? "offen";
  }
}
const getServerSnapshot = () => "server";

let defaultGesetzt = false;

export default function Consent() {
  const stand = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const offen = stand === "offen";
  const box = useRef<HTMLDivElement>(null);

  // Grundzustand des Consent Mode einmal setzen, bevor irgendetwas von Google lädt
  useEffect(() => {
    if (!defaultGesetzt) {
      defaultGesetzt = true;
      window.gtag = gtag;
      gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        security_storage: "granted",
        functionality_storage: "granted",
        wait_for_update: 500,
      });
    }
    if (stand === "alle") {
      setzeConsent("alle");
      ladeGtm();
    }
  }, [stand]);

  // Widerruf aus der Fußzeile: Frage erneut stellen
  useEffect(() => {
    window.svhEinwilligungAendern = () => {
      try {
        window.localStorage.removeItem(CONSENT_KEY);
      } catch {
        /* nichts gespeichert */
      }
      (window as unknown as { __svhWahl?: string }).__svhWahl = undefined;
      window.dispatchEvent(new Event(EVENT));
    };
    return () => {
      delete window.svhEinwilligungAendern;
    };
  }, []);

  // Feste CTA-Leiste mobil weicht dem Feld aus. Beim Öffnen Fokus auf das Fenster selbst
  // (nicht modal, ohne zu scrollen): Tastatur-Nutzer sind mit dem nächsten Tab bei den
  // Knöpfen, und keiner der beiden gleichwertigen Knöpfe steht hervorgehoben da.
  useEffect(() => {
    const html = document.documentElement;
    if (offen) {
      html.setAttribute("data-consent-open", "");
      requestAnimationFrame(() => box.current?.focus({ preventScroll: true }));
    } else html.removeAttribute("data-consent-open");
  }, [offen]);

  const entscheide = useCallback((wahl: Einwilligung) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, wahl);
    } catch {
      (window as unknown as { __svhWahl?: string }).__svhWahl = wahl;
    }
    // Consent-Update und Laden übernimmt der Effekt auf „stand“ (kein doppelter Push);
    // „Nur das Nötige“ meldet die Ablehnung hier, weil der Effekt nur „alle“ behandelt
    if (wahl !== "alle") setzeConsent(wahl);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return (
    <>
      {offen ? (
        <div
          ref={box}
          className="cons"
          role="dialog"
          aria-modal="false"
          aria-labelledby="cons-titel"
          aria-describedby="cons-text"
          tabIndex={-1}
        >
          <div className="cons-card">
            <p className="cons-title" id="cons-titel">
              {einwilligung.titel}
            </p>
            <p className="cons-body cons-long" id="cons-text">
              {einwilligung.body} <Link href={einwilligung.mehrHref}>{einwilligung.mehr}</Link>
            </p>
            <p className="cons-body cons-short">
              {einwilligung.kurz} <Link href={einwilligung.mehrHref}>{einwilligung.kurzLink}</Link>
            </p>
            <div className="cons-buttons">
              <button type="button" className="cons-btn" onClick={() => entscheide("alle")}>
                {einwilligung.alle}
              </button>
              <button type="button" className="cons-btn" onClick={() => entscheide("notwendig")}>
                {einwilligung.notwendig}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
