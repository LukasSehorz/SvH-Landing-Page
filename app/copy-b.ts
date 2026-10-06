/*
 * Texte der Startseite (ehemals „Variante B“, seit 06.10.2026 die einzige Seite).
 * Gemeinsame Texte (Knopf, Leiste, Aktuelles, Rechtsseiten, 404, Formular-Mail) stehen in app/copy.ts.
 * Leitlinie: so einfach, dass es ein 12-Jähriger und ein 55-jähriger Geschäftsführer verstehen.
 * Aufbau seit 06.10.2026 nach der Struktur von andreasbaulig.de (nur Aufbau und Psychologie, keine Inhalte):
 *   Versprechen + Beweis (Hero, Google, Logos) → Problem „nicht deine Schuld“ → Was du gewinnst →
 *   Lösungsprinzip (Zahnräder) → System (Leistungen 0–4) → konkrete Lösungen (Bento) → Kunden (Beweis) →
 *   Fahrplan (Workshop) → Programm (Masterplan) → Gründer → „Überzeuge dich selbst“ → Videos →
 *   Für wen → Fragen → Abschluss.
 * Jede Überschrift greift den Abschnitt davor auf (roter Faden), die kleinen Labels darüber zeigen das Kapitel.
 * Auszeichnung in Überschriften: _Wort_ = Verlaufswort.
 *
 * Fakten stammen aus der früheren Variante A (Projekte, Kunden, Workshop, Masterplan, Team, Videos),
 * aus zwei geprüften Studien (Quellen bei problemB) und aus Angaben von Jannik (04.10.2026).
 * Alles, was noch bestätigt oder geliefert werden muss, ist mit „OFFEN“ markiert.
 */

// Seitentitel und Beschreibung der Startseite (Suchmaschinen, geteilte Links)
export const metaB = {
  title: "KI-Automatisierung für den Mittelstand | SvH Consulting",
  description: "Die KI-Automatisierungen, die deinem Unternehmen fehlen, um jeden Monat Zeit zu sparen. Starte mit dem kostenlosen KI-Workshop.",
};

export type SubLink = { label: string; text: string; href: string };
export type NavLink = { label: string; href: string; id: string; sub?: SubLink[]; foot?: { label: string; href: string } };

// Google-Profil (5,0 Sterne, 5 Bewertungen, Stand 04.10.2026): Hero und Kunden verlinken dorthin
const GOOGLE_PROFIL =
  "https://www.google.com/maps/place/SvH+Consulting/@48.3285982,11.8226616,10z/data=!4m6!3m5!1s0x8eafb3c841f9a22f:0xc493185e015a3928!8m2!3d48.3285982!4d11.8226616!16s%2Fg%2F11nvctpln1";

// Reihenfolge wie auf der Seite
export const navB: { links: NavLink[] } = {
  links: [
    { label: "Vorteile", href: "#vorteile", id: "vorteile" },
    {
      label: "Leistungen",
      href: "#leistungen",
      id: "leistungen",
      sub: [
        { label: "Unsere Leistungen 0–4", text: "Fünf Stufen, die aufeinander aufbauen", href: "#leistungen" },
        { label: "Lösungen", text: "Was wir konkret für dich bauen", href: "#loesungen" },
      ],
      foot: { label: "Alle Leistungen im Überblick", href: "#leistungen" },
    },
    { label: "Kunden", href: "#kunden", id: "kunden" },
    {
      label: "Ablauf",
      href: "#workshop",
      id: "workshop",
      sub: [
        { label: "KI-Workshop", text: "Der kostenlose Start für deinen Betrieb", href: "#workshop" },
        { label: "KI-Masterplan", text: "Dein Fahrplan, 48 Stunden danach", href: "#masterplan" },
      ],
    },
    {
      label: "Über uns",
      href: "#ueber-uns",
      id: "ueber-uns",
      sub: [
        { label: "Über uns", text: "Die Gründer hinter SvH Consulting", href: "#ueber-uns" },
        { label: "Aktuelles", text: "Neue Videos rund um KI im Betrieb", href: "#aktuelles" },
      ],
    },
  ],
};

export const heroB = {
  // OFFEN: „12 Wochen“ steht nicht in A, vor dem Livegang bestätigen
  h1: "Die _KI-Automatisierungen_, die deinem Unternehmen fehlen, um jeden Monat Zeit zu sparen",
  sub: "Wie du deinen Betrieb innerhalb von 12\u00a0Wochen mit KI zukunftsfähig aufstellst – ohne neue Mitarbeiter einzustellen oder selbst Technik-Experte zu werden.",
  // Jeder Haken beantwortet eine eigene Frage: Wie nutze ich KI? Wo verliere ich Zeit? Was bekomme ich? Warum klappt es bisher nicht?
  punkte: [
    "Erhalte Klarheit darüber, wie du KI richtig nutzt und in deinem Unternehmen einsetzt",
    "Finde im kostenlosen KI-Workshop heraus, welche Aufgaben in deinem Betrieb am meisten Zeit fressen",
    "Bekomme einen fertigen Plan mit den 3 Automatisierungen, die sich für dich am meisten lohnen",
    "Verstehe, warum KI in deinem Unternehmen noch nicht richtig funktioniert – und wie sich das ändert",
  ],
  video: {
    titel: "Kurz erklärt: So gewinnst du Zeit mit KI",
    platzhalter: "Video folgt",
  },
  // Google-Sterne direkt unter der Überschrift (echte Werte, Link aufs Profil)
  google: {
    schnitt: "5,0",
    text: "bei Google",
    anzahl: "5 Bewertungen",
    href: GOOGLE_PROFIL,
    label: "5,0 von 5 Sternen bei Google, 5 Bewertungen (öffnet in neuem Fenster)",
  },
  // OFFEN: Foto von Jannik und Lukas, z. B. "/b/gruender.jpg". Leer = kein Hintergrundbild.
  hintergrund: "",
};

// Zahlen wie in Variante A; die 160 Std. stammen aus dem Projekt mit der Estera GmbH
export const trustB = [
  { big: "35+", small: "umgesetzte KI-Projekte" },
  { big: "bis zu 160 Std.", small: "pro Woche gespart bei", logo: "estera" },
  { big: "Geld zurück", small: "wenn wir dir keine Zeit sparen" },
  { big: "0 €", small: "für Workshop und Masterplan" },
];

// Kunden-Logos (Dateien in public/kunden/). Anzahl weiterer Projekte = 35 − Logos.
export const logosB = {
  label: "Diese Unternehmen arbeiten schon mit uns",
  gesamt: 35,
  weitere: (n: number) => `+${n} weitere Projekte`,
  neuesFenster: "öffnet in neuem Fenster",
  firmen: [
    { id: "estera", name: "Estera GmbH", href: "https://estera.immobilien/" },
    { id: "fuchspools", name: "Fuchs Pools", href: "https://fuchspools.com/" },
    { id: "brandhuber", name: "Brandhuber GmbH", href: "https://brandhuber.gmbh/" },
    { id: "world-of-less", name: "World of Less Logistic Trading", href: "https://world-of-less.de/" },
    { id: "innnatur", name: "InnNatur Heilpraktiker", href: "https://innnatur-heilpraktiker.de/" },
    { id: "physio-schediwy", name: "Physiotherapie Schediwy", href: "https://www.physio-schediwy.de/" },
    { id: "ke-fraestechnik", name: "KE Frästechnik", href: "https://ke-fraestechnik.de/" },
  ],
};

// Problem → Folgen → SvH → Vorteile, als ein zusammenhängendes Schaubild
export const problemB = {
  label: "Das Problem",
  titel: "Es ist nicht deine _Schuld_.",
  text: "Fast jeder Betrieb probiert KI aus, aber kaum einer bekommt sie richtig zum Laufen. Was fehlt, ist ein klarer Plan.",
  studie1: {
    balken: [
      { wert: 88, label: "nutzen KI", farbe: "rot" },
      { wert: 7, label: "richtig eingeführt", farbe: "gruen" },
    ],
    quelle: "McKinsey, The State of AI, 2025",
    href: "https://www.mckinsey.com/featured-insights/charts/ai-at-work-but-not-at-scale",
  },
  studie2: {
    // Atlassian: ein Viertel der Arbeitszeit geht fürs Suchen drauf, bei 40 Std. also rund 10 Std.
    titel: "10 Stunden pro Woche sucht jeder Mitarbeiter nach Informationen.",
    unter: "Das ist ein Viertel seiner Arbeitszeit.",
    fazit: "Rechnerisch arbeitet jeder Vierte deiner Mitarbeiter umsonst.",
    quelle: "Atlassian, State of Teams 2025",
    href: "https://www.atlassian.com/blog/state-of-teams-2025",
  },
  quelleLabel: "Quelle",
  folgen: {
    titel: "Was passiert, wenn du nichts änderst",
    punkte: [
      "Riesiger Zeitverlust, jeden Tag",
      "Umsatz geht flöten, weil Anfragen liegen bleiben",
      "Dein Team ist überlastet und macht Fehler",
      "Die Konkurrenz mit KI zieht davon",
    ],
  },
  vorteileTitel: "Was du mit uns _gewinnst_",
  vorteile: [
    { titel: "Zeit sparen", text: "Die immer gleiche Arbeit erledigt sich von allein." },
    { titel: "Schneller antworten", text: "Angebote und Antworten in Minuten statt Tagen." },
    { titel: "Weniger Fehler", text: "Nichts wird falsch abgetippt oder vergessen." },
    { titel: "Immer erreichbar", text: "Telefon, E-Mail und Chat, auch nach Feierabend." },
    { titel: "Wachsen ohne neue Mitarbeiter", text: "Mehr Aufträge mit dem Team, das du hast." },
    { titel: "Umsatz steigern", text: "Keine Anfrage geht mehr verloren." },
  ],
};

/* Unsere Leistungen 0–4 (Lukas, 06.10.2026). Satzbau angelehnt an „Unsere Haupt-Angebote“ von Apex:
   „Wir tun X – damit du Y“. Eigene Worte, du-Form, Kinder-Test: jede Stufe hat einen „Einfach erklärt“-Satz.
   0 ist der Start (Workshop), 1–4 bauen aufeinander auf und laufen als Kreislauf im Unendlichkeitszeichen:
   Lage am Zeichen: 1 oben links, 2 unten rechts, 3 oben rechts, 4 unten links, 0 in der Mitte (Kreuzung). */
export const leistungenB = {
  label: "So gehen wir vor",
  titel: "Unsere _Leistungen_",
  text: "Fünf Stufen, die aufeinander aufbauen. Jedes Projekt startet bei 0, und jede weitere Stufe spart dir mehr Zeit.",
  mehr: "Mehr erfahren",
  einfachLabel: "Einfach erklärt",
  start: "Start",
  teile: [
    {
      nr: 0,
      kurz: "KI-Workshop",
      titel: "KI-Workshop",
      text: "Wir schauen uns in 45 Minuten an, wie dein Betrieb arbeitet, und finden die Aufgaben, die am meisten Zeit fressen – damit du genau weißt, wo sich KI für dich lohnt.",
      einfach: "Wir schauen zusammen, wo bei dir die Zeit verloren geht. Kostenlos.",
      href: "#workshop",
    },
    {
      nr: 1,
      kurz: "Wissen",
      titel: "KI-Wissensmanagement",
      text: "Wir bündeln das Wissen aus Köpfen, Ordnern und Postfächern an einem Ort und machen es per Frage abrufbar – damit dein Team in Sekunden Antworten findet, statt jede Woche Stunden zu suchen.",
      einfach: "Eine KI, die alles über deinen Betrieb weiß und sofort antwortet.",
      href: "#loesungen",
    },
    {
      nr: 2,
      kurz: "Prozesse",
      titel: "Digitale Prozesse",
      text: "Wir erfassen deine Abläufe, ersetzen Zettel, Excel-Listen und doppeltes Abtippen durch klare digitale Wege und verbinden deine Programme – damit Daten von allein dorthin fließen, wo sie gebraucht werden.",
      einfach: "Schluss mit Zettelwirtschaft: Jede Info ist dort, wo sie hingehört.",
      href: "#loesungen",
    },
    {
      nr: 3,
      kurz: "Automatisierung",
      titel: "KI-Automatisierungen",
      text: "Wir bauen Automatisierungen, die Angebote, Rechnungen, Anfragen und Berichte von allein erledigen – damit dein Team die immer gleiche Arbeit los ist und sich um Kunden und Wachstum kümmert.",
      einfach: "Wie ein Fließband für deine Büroarbeit.",
      href: "#loesungen",
    },
    {
      nr: 4,
      kurz: "Agenten",
      titel: "KI-Agenten",
      text: "Deine digitalen Kollegen: KI-Agenten gehen ans Telefon, beantworten E-Mails, Chats und WhatsApp und tragen Termine ein, rund um die Uhr – damit keine Anfrage mehr liegen bleibt, ganz ohne zusätzliche Mitarbeiter.",
      einfach: "Ein Kollege, der nie Feierabend macht.",
      href: "#loesungen",
    },
  ],
};

// Workshop als Ablauf von oben nach unten (Angaben von Jannik, 04.10.2026)
export const workshopB = {
  label: "So startest du",
  titel: "Der kostenlose _KI-Workshop_",
  text: "Dein erster Schritt kostet nichts. Bevor wir irgendetwas bauen, verstehen wir deinen Betrieb. So läuft es ab, Schritt für Schritt.",
  schritte: [
    {
      titel: "KI-Workshop",
      tag: "45 Minuten",
      text: "Das passiert im Workshop:",
      punkte: [
        "Du erzählst, wie dein Betrieb arbeitet.",
        "Gemeinsam finden wir deine 5 bis 10 größten Zeitfresser.",
        "Wir schauen uns an, was bei dir gut läuft, was nicht und ob wir dir überhaupt helfen können.",
      ],
      preis: "0 €",
    },
    {
      titel: "KI-Masterplan",
      tag: "nach 48 Stunden",
      text: "Wir schreiben dir die 3 Automatisierungen mit dem größten Hebel auf, mit Lösungsweg. Dann besprechen wir den Plan gemeinsam.",
      punkte: [] as string[],
      preis: "0 €",
    },
    {
      titel: "Umsetzung",
      tag: "Zeit gewinnen",
      text: "Wir bauen und testen die Helfer und zeigen deinem Team, wie alles funktioniert. Ab dann gewinnst du jede Woche Zeit.",
      punkte: [] as string[],
      preis: "",
    },
  ],
  hinweis: "Bis zur Umsetzung kostet dich nichts etwas. Den Masterplan behältst du so oder so.",
  // OFFEN: großes Bild rechts (z. B. Foto aus einem Workshop), "/b/workshop.jpg"
  bild: "",
  bildFolgt: "Bild folgt",
  // Preis-Kasten auf dem Bild (Wert laut Jannik, 05.10.2026)
  preis: { titel: "Dein KI-Masterplan", alt: "1.099\u00a0€", neu: "0\u00a0€", text: "für dich kostenlos nach dem Workshop" },
};

/* Lösungen (Bento wie „Intelligente Automations“ bei Apex, Lukas 06.10.2026): Stil und Bewegung als Vorbild,
   Texte und Abbildungen eigen. Die sieben Lösungen stammen aus Lukas' Pyramide, jede gehört zu einer Stufe (1–4).
   Inhalte in den kleinen Abbildungen sind erfundene Beispiele (nur Bild, für Screenreader ausgeblendet). */
export const loesungenB = {
  label: "Was wir bauen",
  titel: "Intelligente _Automatisierungen_. Gebaut für deinen Betrieb.",
  text: "Aus den fünf Stufen entstehen ganz konkrete Helfer. Keine Vorlagen von der Stange: Wir bauen genau das, was dein Betrieb braucht, und verbinden es mit den Programmen, die du schon hast.",
  stufe: (nr: number) => `Stufe ${nr}`,
  karten: [
    {
      id: "business",
      stufe: 3,
      titel: "Business-Automatisierung",
      text: "Angebote, Rechnungen, Erinnerungen und Berichte laufen von allein. Dein Team gibt nur noch frei.",
      ui: { aufgaben: ["Angebot erstellt", "Rechnung verschickt", "Zahlung erinnert", "Bericht für Montag"] },
    },
    {
      id: "crm",
      stufe: 2,
      titel: "CRM-Einrichtung & Automatisierungen",
      text: "Wir richten deine Kundenliste (CRM) ein und verbinden sie mit E-Mail, Kalender, Webseite und Buchhaltung. Jede Anfrage landet von allein am richtigen Platz.",
      ui: { mitte: "CRM", programme: ["E-Mail", "Kalender", "Webseite", "Telefon", "Buchhaltung", "Tabellen"] },
    },
    {
      id: "wissen",
      stufe: 1,
      titel: "KI-Wissensdatenbank",
      text: "Frag einfach, die KI antwortet sofort und nennt die Quelle. Aus Handbüchern, Preislisten und E-Mails deines Betriebs.",
      ui: {
        frage: "Wie lange gilt die Garantie auf Terrassendächer?",
        antwort: "5 Jahre auf die Konstruktion, 2 Jahre auf Markisen.",
        quelle: "Garantiebedingungen, S. 2",
      },
    },
    {
      id: "agenten",
      stufe: 4,
      titel: "Personalisierte KI-Agenten",
      text: "Ein digitaler Kollege, der deine Sprache spricht, deine Preise kennt und nur tut, was du freigibst.",
      ui: {
        name: "Dein Vertriebs-Agent",
        regeln: ["Kennt deine Preise und Produkte", "Antwortet in deinem Ton", "Trägt Termine ein", "Fragt bei Unklarem nach"],
      },
    },
    {
      id: "fulfilment",
      stufe: 2,
      titel: "Fulfilment-Systeme",
      text: "Vom Auftrag bis zur Lieferung läuft jeder Schritt wie am Fließband. Nichts bleibt liegen, jeder weiß, was als Nächstes kommt.",
      ui: { schritte: ["Auftrag da", "Eingeplant", "In Arbeit", "Geliefert"] },
    },
    {
      id: "whatsapp",
      stufe: 4,
      titel: "KI-WhatsApp-Kundenservice",
      text: "Deine Kunden schreiben per WhatsApp, die KI antwortet sofort, auch nachts. Schwierige Fälle gibt sie an dein Team weiter.",
      ui: {
        nachrichten: [
          { von: "kunde", text: "Habt ihr am Samstag offen?" },
          { von: "ki", text: "Ja, von 9 bis 13 Uhr. Soll ich dir einen Termin eintragen?" },
          { von: "kunde", text: "Gerne, um 10 Uhr." },
        ],
      },
    },
    {
      id: "voice",
      stufe: 4,
      titel: "Voice- & Chat-Agenten",
      text: "Am Telefon und im Chat auf deiner Webseite: Der Agent nimmt Anfragen an, beantwortet Fragen und bucht Termine, rund um die Uhr.",
      ui: { anruf: "Anruf um 21:14 Uhr", status: ["Anruf angenommen", "Frage beantwortet", "Termin eingetragen"] },
    },
  ],
};

/* Kunden: echte Google-Bewertungen (Profil „SvH Consulting“, 5,0 Sterne, Stand 04.10.2026), wortgetreu.
   Zuordnung laut Jannik (04.10.2026). OFFEN: was bei Taxi Izi, Betthupferl und zGraniT RxyaL umgesetzt wurde.
   Bei Izzet Tüymen fehlt bewusst der Schlusssatz „Vielen Dank für deine Unterstützung! 🙌“ (klingt nach unserer Antwort). */
export type Bewertung = { name: string; firma: string; logo: string; href: string; sterne: number; datum: string; text: string; umgesetzt: string };

export const kundenB = {
  label: "Ergebnisse",
  titel: "Was unsere Kunden _sagen_",
  text: "Klingt gut? Das sagen die Betriebe, für die wir es schon gebaut haben. Echte Bewertungen von Google, dazu, was wir umgesetzt haben.",
  schnitt: "5,0",
  anzahl: "5 Google-Bewertungen",
  profil: GOOGLE_PROFIL,
  // Karussell: eine Reihe, Pfeile drehen endlos weiter
  zurueck: "Vorherige Bewertung",
  vor: "Nächste Bewertung",
  bereich: "Google-Bewertungen",
  position: (i: number, n: number) => `Bewertung ${i} von ${n}`,
  profilLink: "Alle Bewertungen auf Google",
  google: "Google-Bewertung",
  umgesetzt: "Was wir umgesetzt haben",
  folgt: "Details folgen",
  weiter: "Weiterlesen",
  weniger: "Weniger anzeigen",
  bewertungen: [
    {
      name: "Orfe",
      firma: "Estera GmbH",
      logo: "estera",
      href: "https://estera.immobilien/",
      sterne: 5,
      datum: "September 2026",
      text: "Wir waren mega zufrieden mit der Zusammenarbeit! Die Jungs waren immer zuverlässig, haben sehr gute Qualität schnell geliefert und Anderungswünsche direkt umgesetzt. Durch die Automatisierungen konnten wir bis zu 160 Stunden im Monat einsparen. Können die Jungs nur weiterempfehlen!",
      umgesetzt: "Neue Webseite, digitale Kundenverwaltung (CRM) und smarte Automatisierungen dahinter.",
    },
    {
      name: "oliver fuchs",
      firma: "Fuchs Pools",
      logo: "fuchspools",
      href: "https://fuchspools.com/",
      sterne: 5,
      datum: "September 2026",
      text: "Ich war mit der Zusammenarbeit und dem Ergebnis rundum zufrieden! Die Firma hat von Anfang an zuverlässig und professionell gearbeitet. Meine Fragen wurden schnell beantwortet und Änderungswünsche unkompliziert umgesetzt. Besonders gefallen hat mir, dass meine Vorstellungen ernst genommen wurden und ich immer einen Ansprechpartner hatte. Die Arbeit wurde zügig erledigt und die Qualität hat mich überzeugt. Ich würde die Firma jederzeit wieder beauftragen und kann sie auf jeden Fall weiterempfehlen!",
      umgesetzt: "Neue Webseite, automatische Angebotserstellung und automatisiertes Marketing.",
    },
    {
      name: "Izzet Tüymen",
      firma: "Taxi Izi",
      logo: "taxiizi",
      href: "https://taxi-izi.de/",
      sterne: 5,
      datum: "Oktober 2026",
      text: "Für mich zählt am Ende vor allem das Ergebnis, und das ist hier wirklich erstklassig. Man sieht an jedem Detail, dass die Jungs sauber und mit hohem Anspruch gearbeitet haben. Nichts wirkt halbfertig oder schnell zusammengeschustert, im Gegenteil: Sie haben an Dinge gedacht, die mir selbst gar nicht aufgefallen wären. Auch aus meinem Umfeld habe ich dazu schon mehrfach positives Feedback bekommen. Die Zusammenarbeit war dabei angenehm und unkompliziert. Wer Wert auf Qualität legt, ist bei Jannik & Lukas genau richtig.",
      // OFFEN: bestätigen (abgeleitet aus dem Webdesign-Projekt Taxiizi)
      umgesetzt: "Neue Webseite für den Taxi- und Limousinenservice.",
    },
    {
      name: "Max TV",
      firma: "Betthupferl",
      logo: "betthupferl",
      href: "https://betthupferl-traunstein.de/",
      sterne: 5,
      datum: "Oktober 2026",
      text: "Absolut zuverlässig. Was abgemacht wurde, wurde auch eingehalten!",
      // OFFEN: bestätigen (abgeleitet aus dem Webdesign-Projekt Betthupferl)
      umgesetzt: "Neue Webseite für die Boutique in Traunstein.",
    },
    {
      name: "zGraniT RxyaL",
      firma: "",
      logo: "",
      href: "",
      sterne: 5,
      datum: "September 2026",
      text: "Absolute Empfehlung! Ich habe mich bei SvH Consulting von Anfang an sehr gut aufgehoben gefühlt. Die Beratung war professionell, kompetent und gleichzeitig angenehm persönlich. Auf meine Fragen wurde individuell eingegangen und alles verständlich und transparent erklärt. Besonders positiv fand ich die schnelle und unkomplizierte Kommunikation sowie die zuverlässige Betreuung. Man merkt, dass hier wirklich Wert auf die Bedürfnisse des Kunden gelegt wird. Vielen Dank für die tolle Zusammenarbeit, ich kann SvH Consulting uneingeschränkt weiterempfehlen!",
      umgesetzt: "",
    },
  ] as Bewertung[],
};

export const teamB = {
  label: "Wer dahintersteckt",
  titel: "Die Gründer hinter _SvH Consulting_",
  people: [
    // OFFEN: Fotos ("/b/lukas.jpg", "/b/jannik.jpg"); Texte sind Entwürfe, bitte prüfen und ergänzen
    {
      name: "Lukas Sehorz",
      rolle: "Gründer · Digitalisierung und Prozessoptimierung",
      initials: "LS",
      foto: "",
      text: [
        "Lukas hat Digitalisierung und Prozessoptimierung studiert. Genau das ist sein Antrieb: Abläufe so lange zu vereinfachen, bis sie wie von selbst laufen.",
        "Er schaut sich an, wie ein Betrieb heute wirklich arbeitet, findet die Stellen, an denen jeden Tag Zeit verloren geht, und macht daraus Automatisierungen, die im Alltag funktionieren. Ihm ist wichtig, dass am Ende nicht nur die Technik läuft, sondern dass dein Team versteht, was passiert, und gern damit arbeitet.",
      ],
    },
    {
      name: "Jannik vom Hofe",
      rolle: "Gründer · KI und Kommunikation",
      initials: "JvH",
      foto: "",
      text: [
        "Jannik beschäftigt sich jeden Tag mit den neuesten Entwicklungen rund um KI und zeigt auf seinem YouTube-Kanal, was davon für Betriebe wirklich zählt.",
        "Er übersetzt Technik in Alltagssprache, damit jeder versteht, was KI im eigenen Unternehmen leisten kann. Sein Anspruch: keine leeren Versprechen, sondern messbare Ergebnisse, die man jede Woche im Kalender spürt.",
      ],
    },
  ],
  fotoFolgt: "Foto folgt",
};

export const aktuellesB = {
  label: "Aktuelles",
  title: "Einblicke in die _KI-Welt_",
  text: "Auf YouTube und LinkedIn zeigen wir, was in der KI gerade passiert und was davon für deinen Betrieb wirklich zählt.",
  ansehen: "Video ansehen",
  alle: "Alle Videos auf YouTube",
  linkedinTitel: "Folge uns auf LinkedIn",
  linkedin: [
    { name: "Jannik vom Hofe", href: "https://www.linkedin.com/in/jannik-vom-hofe-b525b53b4/" },
    { name: "Lukas Sehorz", href: "https://www.linkedin.com/in/lukas-sehorz-324870242/" },
  ],
  linkedinSub: "auf LinkedIn",
};

// Nächster Schritt: schwarzer Kasten mit Bild-Logo links (Vorbild: andreasbaulig.de „Überzeuge dich selbst“)
export const naechsterB = {
  titel: ["Überzeuge dich selbst.", "Ganz unverbindlich."],
  absaetze: [
    "Um uns und unsere Arbeit kennenzulernen, bieten wir dir einen kostenlosen KI-Workshop an. Dort schauen wir uns gemeinsam an, wie dein Betrieb arbeitet.",
    "Meistens sprechen wir über Themen wie: Angebote, E-Mails, Kundenanfragen, Rechnungen und das Wissen im Betrieb.",
    "Gerne schauen wir uns aber auch individuelle Themen an, die gerade deinen Betrieb betreffen.",
    "Mache noch heute den ersten Schritt.",
  ],
};

/* Zahnräder: das Lösungsprinzip direkt nach dem Problem (Baulig: „Was dich erwartet“).
   Brücke: Problem „kein klarer Plan, lauter Einzel-Tools“ → Lösung „ein System“ → Leistungen 0–4 „so bauen wir es“. */
export const zahnradB = {
  label: "Die Lösung",
  titel: "Spare dir _systematisch_ Zeit, statt noch ein Tool zu kaufen.",
  text: "Die meisten Betriebe kaufen hier ein Tool und dort ein Abo. Nichts passt zusammen, und am Ende tippt doch wieder jemand ab. Wir machen es andersrum: KI kommt als Motor in die Mitte deines Betriebs. Dreht sich das große Rad, drehen alle Bereiche mit.",
  punkte: [
    "Jeder Bereich gewinnt Zeit, nicht nur einer",
    "Alles greift ineinander, nichts wird doppelt gemacht",
    "Dein Betrieb ist zukunftssicher aufgestellt",
  ],
  weiter: "So bauen wir das auf: in fünf Stufen",
  weiterHref: "#leistungen",
  mitte: "KI",
  // lang = Desktop, kurz = Handy (größere Schrift, deshalb mit Trennung)
  bereiche: [
    { lang: "Vertrieb", kurz: "Vertrieb" },
    { lang: "Marketing", kurz: "Marke-\nting" },
    { lang: "Buchhaltung", kurz: "Buch-\nhaltung" },
    { lang: "Kunden-\nservice", kurz: "Kunden-\nservice" },
    { lang: "Einkauf\n& Lager", kurz: "Einkauf\n& Lager" },
  ],
};

// Masterplan-Kasten: schwarz, mit Laptop (Vorbild: andreasbaulig.de „Unser System als Training“). Inhalte wie in A.
export const masterplanB = {
  label: "Das bekommst du",
  titel: "Dein KI-Masterplan: der Fahrplan, mit dem dein Betrieb jede Woche Zeit gewinnt.",
  intro: "48 Stunden nach dem Workshop bekommst du deinen persönlichen KI-Masterplan. Kostenlos, und er gehört dir, egal wie du dich danach entscheidest.",
  punkte: [
    { titel: "Deine Zeitfresser", text: "Schwarz auf weiß, wo in deinem Betrieb jede Woche die 5 bis 10 größten Zeitfresser stecken." },
    { titel: "Die 3 besten Automatisierungen", text: "Wo du mit dem wenigsten Aufwand am meisten Zeit oder Geld sparst." },
    { titel: "Der Lösungsweg", text: "Verständlich erklärt, welche Werkzeuge es braucht und wie man vorgeht. Danach gehen wir alles gemeinsam durch." },
  ],
  doc: { titel: "KI-Masterplan", fuer: "für deinen Betrieb", von: "erstellt von SvH Consulting", zeitfresser: "Deine größten Zeitfresser", balken: ["Angebote", "E-Mails", "Abtippen", "Suchen", "Nachfassen"], top3: "Top 3 Automatisierungen" },
};

// Auswahl aus den Fragen von Variante A
export const fragenB = {
  label: "Fragen",
  title: "Was Unternehmer uns vorher fragen.",
  nochFragen: "Deine Frage ist nicht dabei? Ruf uns einfach an:",
  items: [
    { q: "Was kostet mich der Workshop?", a: "Nichts. Der Workshop, der KI-Masterplan und die Besprechung sind kostenlos, und du gehst dabei keine Verpflichtung ein." },
    { q: "Wo ist der Haken?", a: "Es gibt keinen. Wir verdienen erst dann Geld, wenn du dich entscheidest, den Plan mit uns umzusetzen. Wenn nicht, hast du trotzdem einen fertigen Plan in der Hand." },
    { q: "Wir kennen uns mit KI gar nicht aus. Ist das ein Problem?", a: "Im Gegenteil, genau dafür sind wir da. Wir erklären alles in normaler Sprache und zeigen deinem Team Schritt für Schritt, wie die Helfer funktionieren." },
    { q: "Lohnt sich das auch für kleinere Betriebe?", a: "Ja. Gerade dort fällt jede gewonnene Stunde auf. Im Workshop sehen wir gemeinsam, ob und wo es sich für dich rechnet." },
    { q: "Was passiert mit unseren Daten?", a: "Das besprechen wir offen im Workshop. Wir wählen Werkzeuge, die zu deinen Anforderungen an den Datenschutz passen, und bauen nur, was du verstehst und freigibst." },
    { q: "Wie funktioniert die Geld-zurück-Garantie?", a: "Vor dem Start legen wir gemeinsam schriftlich fest, wie viel Zeit oder Geld die Umsetzung sparen soll. Wird das Ziel verfehlt, bekommst du dein Geld zurück. Die genauen Bedingungen stehen in deinem Angebot." },
    { q: "Sind wir danach von euch abhängig?", a: "Nein. Alles, was wir bauen, schreiben wir auf und übergeben es an dein Team. Du kannst jederzeit selbst weitermachen." },
  ],
};

// Anmeldung: Felder und Werte passend zu /api/anfrage (gleiche Liste wie Variante A)
// Anmeldung im Fenster (öffnet sich bei jedem Knopf „Kostenlosen KI-Workshop sichern“)
// Für wen: ehrliche Ja/Nein-Liste vor den Fragen (Baulig: „Für wen ist das?“)
export const fuerWenB = {
  label: "Passt das zu dir?",
  titel: "Für wen das _passt_, und für wen nicht.",
  ja: {
    titel: "Das passt, wenn …",
    punkte: [
      "dein Team jede Woche Stunden mit Abtippen, Angeboten oder E-Mails verbringt",
      "du wachsen willst, ohne gleich neue Leute einzustellen",
      "ihr KI schon ausprobiert habt, es aber noch nicht richtig läuft",
      "du offen bist, Abläufe zu ändern, wenn es sich lohnt",
    ],
  },
  nein: {
    titel: "Das passt nicht, wenn …",
    punkte: [
      "du nur ein weiteres Tool-Abo suchst",
      "du eine Wunderlösung ohne jede Mitarbeit erwartest",
      "in deinem Betrieb alles bleiben soll, wie es ist",
    ],
  },
};

// Abschluss ganz unten (Baulig: letzter Aufruf), Satz wie das LinkedIn-Banner
export const abschlussB = {
  titel: "Wir stellen die KI auf, _du gewinnst die Zeit_.",
  text: "Starte mit dem kostenlosen KI-Workshop. 45 Minuten, danach weißt du, wo dein Betrieb jede Woche Zeit verliert und was sich zuerst lohnt.",
  punkte: ["0 € für Workshop und Masterplan", "Der Plan gehört dir, egal wie du dich entscheidest", "Geld zurück, wenn wir dir keine Zeit sparen"],
};

export const terminB = {
  label: "Dein nächster Schritt",
  title: "Sichere dir deinen kostenlosen _KI\u2011Workshop_.", // geschützter Bindestrich: nie „KI- / Workshop“
  text: "Trag dich in zwei Minuten ein. Wir melden uns persönlich bei dir und finden einen Termin, der dir passt.",
  schliessen: "Schließen",
  danachTitel: "So geht es weiter",
  danach: [
    "Wir melden uns persönlich, um einen Termin zu finden.",
    "Im kostenlosen Workshop finden wir deine größten Zeitfresser.",
    "48 Stunden danach hältst du deinen KI-Masterplan in der Hand.",
  ],
  direkt: "Lieber direkt sprechen?",
  form: {
    tasks: "Was frisst bei dir am meisten Zeit?",
    tasksHint: "Mehrfachauswahl",
    hours: "Wie viele Stunden pro Woche kostet das dein Team ungefähr?",
    hoursUnit: "Std. pro Woche",
    hoursCalc: (h: number) => `Das sind rund ${h * 52} Stunden im Jahr.`,
    size: "Wie viele Mitarbeiter hat dein Betrieb?",
    name: "Dein Name",
    company: "Firma",
    email: "E-Mail",
    phone: "Telefon",
    message: "Möchtest du uns noch etwas sagen?",
    optional: "optional",
    consentBefore: "Ich bin einverstanden, dass SvH Consulting meine Angaben zur Bearbeitung der Anfrage verwendet. Mehr dazu in der ",
    consentLink: "Datenschutzerklärung",
    consentAfter: ".",
    submit: "Kostenlosen KI-Workshop sichern",
    sending: "Wird gesendet",
    below: "Kostenlos · unverbindlich · deine Angaben bleiben bei uns",
    errors: {
      tasks: "Bitte wähle mindestens eine Aufgabe aus.",
      employees: "Bitte wähle die Größe deines Betriebs.",
      name: "Bitte gib deinen Namen an.",
      company: "Bitte gib deine Firma an.",
      email: "Bitte gib eine gültige E-Mail-Adresse an.",
      consent: "Bitte bestätige kurz dein Einverständnis.",
    },
    success: (first: string) => (first ? `Danke, ${first}! Deine Anfrage ist bei uns.` : "Danke! Deine Anfrage ist bei uns."),
    successText: "Wir melden uns persönlich bei dir, um einen Termin für deinen KI-Workshop zu finden.",
    fallback: "Dein E-Mail-Programm öffnet sich mit deiner Nachricht an uns. Du musst sie nur noch abschicken.",
    fallbackLink: "E-Mail-Programm erneut öffnen",
    failure: "Das hat leider nicht geklappt. Ruf uns gern direkt an oder schreib uns eine E-Mail:",
  },
};

export const footerB = {
  claim: "Wir machen KI so einfach, dass jeder sie versteht.",
  kontakt: "Kontakt",
  bereiche: "Auf dieser Seite",
  seiten: "Rechtliches",
  links: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "AGB", href: "/agb" },
  ],
  copyright: "© 2026 SvH Consulting · Sehorz Lukas, vom Hofe Jannik GbR",
};
