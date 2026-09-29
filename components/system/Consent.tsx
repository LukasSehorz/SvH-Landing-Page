"use client";

/*
 * Einwilligung und Nachladen des Google Tag Manager (funktional wie die alte Seite).
 * Beim ersten Aufruf steht der Consent Mode auf abgelehnt, bevor irgendetwas von
 * Google geladen wird. Erst „Einverstanden“ lädt gtm.js nach. „Nur das Nötige“
 * lädt nichts und speichert nur die Entscheidung im Browser.
 */

import { useCallback, useEffect, useState } from "react";
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

function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // Der Tag Manager erwartet das arguments-Objekt, kein Array
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

export default function Consent() {
  const [stand, setStand] = useState<Einwilligung | null>(null);
  const [gefragt, setGefragt] = useState(false);

  useEffect(() => {
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
    let gemerkt: string | null = null;
    try {
      gemerkt = window.localStorage.getItem(CONSENT_KEY);
    } catch {
      /* Ablage gesperrt: Frage bei jedem Aufruf */
    }
    if (gemerkt === "alle" || gemerkt === "notwendig") {
      setStand(gemerkt);
      if (gemerkt === "alle") {
        setzeConsent("alle");
        ladeGtm();
      }
    }
    setGefragt(true);
    window.svhEinwilligungAendern = () => setStand(null);
    return () => {
      delete window.svhEinwilligungAendern;
    };
  }, []);

  const offen = gefragt && stand === null;

  // Feste CTA-Leiste mobil weicht dem Feld aus
  useEffect(() => {
    const html = document.documentElement;
    if (offen) html.setAttribute("data-consent-open", "");
    else html.removeAttribute("data-consent-open");
  }, [offen]);

  const entscheide = useCallback((wahl: Einwilligung) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, wahl);
    } catch {
      /* nur für diesen Aufruf */
    }
    setzeConsent(wahl);
    if (wahl === "alle") ladeGtm();
    setStand(wahl);
  }, []);

  return (
    <>
      {offen ? (
        <div className="cons" role="dialog" aria-modal="false" aria-labelledby="cons-titel" aria-describedby="cons-text">
          <div className="cons-card">
            <p className="cons-title" id="cons-titel">
              {einwilligung.titel}
            </p>
            <p className="cons-body" id="cons-text">
              {einwilligung.body} <Link href={einwilligung.mehrHref}>{einwilligung.mehr}</Link>
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
