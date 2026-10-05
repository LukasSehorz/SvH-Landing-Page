import type { ReactNode } from "react";
import { Haken, Pfeil } from "./ui";

/* Kleine Abbildungen aus dem Alltag zu jeder Leistung (alles erfundene Beispiele).
   Reines HTML/CSS, damit sie scharf bleiben und sich der Seite anpassen. */

function Fluss({ links, rechts, mitte }: { links: ReactNode; rechts: ReactNode; mitte: string }) {
  return (
    <div className="bs-fluss">
      {links}
      <div className="bs-fluss-mitte" aria-hidden="true">
        <span className="bs-ki">KI</span>
        <span className="bs-fluss-text">{mitte}</span>
        <Pfeil size={20} />
      </div>
      {rechts}
    </div>
  );
}

function Mail({ von, betreff, text }: { von: string; betreff: string; text: string }) {
  return (
    <div className="bs-karte bs-mail">
      <p className="bs-klein">Von: {von}</p>
      <p className="bs-fett">{betreff}</p>
      <p className="bs-text">{text}</p>
    </div>
  );
}

function Erledigt({ children }: { children: ReactNode }) {
  return (
    <p className="bs-erledigt">
      <Haken size={18} />
      {children}
    </p>
  );
}

export const AUTOMATISIERUNG_BILDER: Record<string, ReactNode> = {
  angebote: (
    <>
      <Fluss
        mitte="erstellt Angebot"
        links={<Mail von="Familie Berger" betreff="Anfrage Terrassendach" text="Hallo, wir hätten gern ein Angebot für ein Terrassendach, ca. 4 × 3 m." />}
        rechts={
          <div className="bs-karte bs-dok">
            <p className="bs-fett">Angebot Nr. 2026-118</p>
            <div className="bs-zeilen">
              <span>Terrassendach Alu 4 × 3 m</span>
              <span>6.480 €</span>
              <span>Montage</span>
              <span>1.150 €</span>
              <span className="bs-summe">Summe netto</span>
              <span className="bs-summe">7.630 €</span>
            </div>
            <span className="bs-pille">Entwurf zur Freigabe</span>
          </div>
        }
      />
      <div className="bs-vergleich">
        <span className="bs-vorher">vorher 1 Tag</span>
        <Pfeil size={16} />
        <span className="bs-nachher">jetzt 30 Min.</span>
      </div>
    </>
  ),
  rechnungen: (
    <>
      <Fluss
        mitte="liest aus"
        links={
          <div className="bs-karte bs-beleg">
            <p className="bs-fett">Baumarkt Huber</p>
            <p className="bs-klein">03.10.2026 · 14:22</p>
            <p className="bs-strich" />
            <p className="bs-text">Schrauben, Dübel, Silikon</p>
            <p className="bs-fett bs-rechts">248,90 €</p>
          </div>
        }
        rechts={
          <div className="bs-karte">
            <div className="bs-tabelle">
              <span>Lieferant</span>
              <span>Baumarkt Huber</span>
              <span>Datum</span>
              <span>03.10.2026</span>
              <span>Betrag</span>
              <span>248,90 €</span>
              <span>Kategorie</span>
              <span>Material</span>
            </div>
            <Erledigt>Verbucht</Erledigt>
          </div>
        }
      />
      <p className="bs-hinweis">
        <span className="bs-pille bs-pille--warn">Rechnung 2026-087 seit 14 Tagen offen</span>
        <Pfeil size={14} />
        Zahlungserinnerung automatisch verschickt
      </p>
    </>
  ),
  anfragen: (
    <Fluss
      mitte="trägt ein"
      links={
        <div className="bs-karte">
          <p className="bs-klein">Kontaktformular · gerade eben</p>
          <p className="bs-fett">Sabine Wagner</p>
          <p className="bs-text">Interesse an einem Pool, Garten ca. 300 m², Start im Frühjahr.</p>
        </div>
      }
      rechts={
        <div className="bs-karte bs-crm">
          <p className="bs-fett">Kundenliste</p>
          <ul>
            <li className="bs-neu">
              <span>Sabine Wagner</span>
              <span className="bs-pille">Neu</span>
            </li>
            <li>
              <span>Familie Berger</span>
              <span className="bs-pille bs-pille--grau">Angebot</span>
            </li>
            <li>
              <span>Thomas Huber</span>
              <span className="bs-pille bs-pille--grau">Auftrag</span>
            </li>
          </ul>
          <Erledigt>Erinnerung: in 3 Tagen nachfassen</Erledigt>
        </div>
      }
    />
  ),
  dokumente: (
    <Fluss
      mitte="überträgt"
      links={
        <div className="bs-karte bs-dok bs-scan">
          <p className="bs-fett">Lieferschein 55120</p>
          <p className="bs-klein">Holzhandel Mayer</p>
          <p className="bs-strich" />
          <p className="bs-text">Lärchenholz 4 m · 24 Stk.</p>
          <p className="bs-text">Schrauben V2A · 500 Stk.</p>
          <p className="bs-text">Folie 2 m · 3 Rollen</p>
        </div>
      }
      rechts={
        <div className="bs-karte">
          <p className="bs-fett">Wareneingang</p>
          <div className="bs-tabelle bs-tabelle--3">
            <span>Artikel</span>
            <span>Menge</span>
            <span />
            <span>Lärchenholz 4 m</span>
            <span>24</span>
            <Haken size={16} />
            <span>Schrauben V2A</span>
            <span>500</span>
            <Haken size={16} />
            <span>Folie 2 m</span>
            <span>3</span>
            <Haken size={16} />
          </div>
          <Erledigt>Ohne Abtippen übertragen</Erledigt>
        </div>
      }
    />
  ),
  berichte: (
    <div className="bs-karte bs-bericht">
      <p className="bs-klein">Montag, 07:00 · automatisch erstellt</p>
      <p className="bs-fett">Dein Wochenbericht · KW 40</p>
      <div className="bs-kpis">
        <div>
          <span className="bs-kpi-zahl">23</span>
          <span className="bs-klein">neue Anfragen</span>
        </div>
        <div>
          <span className="bs-kpi-zahl">9</span>
          <span className="bs-klein">Angebote raus</span>
        </div>
        <div>
          <span className="bs-kpi-zahl">18.400 €</span>
          <span className="bs-klein">Auftragswert</span>
        </div>
      </div>
      <div className="bs-balken" aria-hidden="true">
        {[40, 55, 35, 70, 62, 85, 78].map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
      <p className="bs-klein">Anfragen pro Woche, letzte 7 Wochen</p>
    </div>
  ),
};

export const ASSISTENTEN_BILDER: Record<string, ReactNode> = {
  telefon: (
    <div className="bs-karte bs-chat">
      <p className="bs-klein">Anruf · Dienstag, 21:40 Uhr</p>
      <p className="bs-blase bs-blase--kunde">Hallo, kann ich nächste Woche einen Termin für eine Besichtigung bekommen?</p>
      <p className="bs-blase bs-blase--ki">
        <span className="bs-absender">KI-Telefonassistent</span>
        Gern! Dienstag um 10 Uhr oder Donnerstag um 14 Uhr sind noch frei. Was passt dir besser?
      </p>
      <p className="bs-blase bs-blase--kunde">Dienstag passt.</p>
      <Erledigt>Termin eingetragen · Bestätigung verschickt</Erledigt>
    </div>
  ),
  email: (
    <div className="bs-karte bs-postfach">
      <p className="bs-fett">Posteingang · sortiert</p>
      <ul>
        <li>
          <span className="bs-pille">Anfrage</span>
          <span>Angebot für Wartung?</span>
          <span className="bs-klein">Entwurf bereit</span>
        </li>
        <li>
          <span className="bs-pille bs-pille--grau">Rechnung</span>
          <span>Rechnung 4471 von Lieferant</span>
          <span className="bs-klein">an Buchhaltung</span>
        </li>
        <li>
          <span className="bs-pille bs-pille--grau">Termin</span>
          <span>Verschiebung auf Freitag</span>
          <span className="bs-klein">Kalender aktualisiert</span>
        </li>
      </ul>
      <div className="bs-entwurf">
        <p className="bs-klein">Antwort-Entwurf</p>
        <p className="bs-text">Guten Tag Herr Schmid, gern schicken wir Ihnen ein Angebot für die Wartung. Passt Ihnen ein Termin am …</p>
        <span className="bs-knopf">Freigeben und senden</span>
      </div>
    </div>
  ),
  chat: (
    <div className="bs-karte bs-widget">
      <p className="bs-widget-kopf">
        <span className="bs-punkt-gruen" /> Chat · online
      </p>
      <p className="bs-blase bs-blase--kunde">Habt ihr am Samstag geöffnet?</p>
      <p className="bs-blase bs-blase--ki">
        <span className="bs-absender">KI-Chat</span>
        Ja, samstags von 9 bis 13 Uhr. Soll ich dir gleich einen Rückruf für ein Angebot eintragen?
      </p>
      <p className="bs-blase bs-blase--kunde">Ja, gerne!</p>
      <Erledigt>Anfrage aufgenommen · 23:15 Uhr</Erledigt>
    </div>
  ),
  termine: (
    <div className="bs-termine">
      <div className="bs-karte bs-kalender">
        <p className="bs-fett">Diese Woche</p>
        <div className="bs-woche">
          {["Mo", "Di", "Mi", "Do", "Fr"].map((t, i) => (
            <div key={t} className="bs-tag">
              <span className="bs-klein">{t}</span>
              <span className={`bs-slot${i === 1 ? " bs-slot--neu" : i === 3 ? " bs-slot--belegt" : ""}`}>{i === 1 ? "10:00 Besichtigung" : i === 3 ? "14:00" : ""}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="bs-sms">
        <span className="bs-klein">SMS an Kunde · Montag 18:00</span>
        Erinnerung: Morgen um 10 Uhr kommen wir zur Besichtigung. Bis dann!
      </p>
    </div>
  ),
};
