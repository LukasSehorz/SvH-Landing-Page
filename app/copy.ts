/*
 * Alle sichtbaren Texte der Seite, wortgetreu aus TEXTE.md.
 * Auszeichnung in Überschriften:
 *   *Wort*  = Schreibschrift-Akzent mit gezeichnetem Schwung (höchstens dreimal)
 *   _Wort_  = Verlaufswort (Blau → Violett → Lavendel)
 * Ein Array bei Überschriften bedeutet einen festen Zeilenumbruch („/“ in TEXTE.md).
 *
 * Texte, die NICHT in TEXTE.md stehen, sind mit „// ZUSATZ“ markiert
 * (Bedienhinweise, Fehlermeldungen, Einwilligung und 404 von der alten Seite).
 */

export const meta = {
  title: "KI-Automatisierung für den Mittelstand | SvH Consulting",
  description:
    "Wir bauen digitale Helfer, die die immer gleiche Arbeit in deinem Betrieb übernehmen. Starte mit einem kostenlosen KI-Workshop und deinem persönlichen KI-Masterplan.",
  ogAlt: "Wir stellen die KI auf, du gewinnst die Zeit.",
};

export const cta = {
  main: "Kostenlosen KI-Workshop sichern",
  nav: "Kostenloser KI-Workshop",
};

export const nav = {
  links: [
    { label: "Lösungen", href: "#loesungen", id: "loesungen" }, // ZUSATZ (30.09.2026)
    { label: "So läuft es ab", href: "#fahrplan", id: "fahrplan" },
    { label: "Ergebnisse", href: "#ergebnisse", id: "ergebnisse" },
    { label: "Masterplan", href: "#masterplan", id: "masterplan" },
    { label: "Fragen", href: "#fragen", id: "fragen" },
  ],
  aktuelles: "Aktuelles",
  panelTitle: "Neu auf dem Kanal",
  allVideos: "Alle Videos ansehen",
  channel: "YouTube-Kanal",
  menuOpen: "Menü öffnen", // ZUSATZ (Bedienhinweis für Screenreader)
  menuClose: "Menü schließen", // ZUSATZ
  home: "SvH Consulting, zur Startseite", // ZUSATZ
  skip: "Zum Inhalt springen", // ZUSATZ
};

export const hero = {
  eyebrow: "KI-Automatisierung für den Mittelstand",
  h1: ["Wir stellen die KI auf,", "du *gewinnst* die Zeit."],
  text: "Wir bauen digitale Helfer für deinen Betrieb. Die Helfer schreiben Angebote, beantworten E-Mails und tragen Daten ein, ganz von allein. Dein Team hat wieder Zeit für die Arbeit, die wirklich zählt.",
  sub: "30 bis 45 Minuten · danach dein KI-Masterplan geschenkt",
  secondary: "So läuft es ab",
  proof: [
    { big: "35+", small: "umgesetzte Projekte" },
    { big: "bis zu 160 Std.", small: "pro Woche gespart" },
    { big: "Geld-zurück-Garantie", small: "falls wir dir keine Zeit sparen" },
  ],
  tasks: [
    "Angebot schreiben",
    "E-Mail beantworten",
    "Rechnung prüfen",
    "Termin eintragen",
    "Daten abtippen",
    "Kunden nachfassen",
    "Bericht erstellen",
    "Bewerbung sichten",
  ],
  // ZUSATZ (30.09.2026): Platz für das Erklärvideo (VSL). Solange src leer ist, zeigt die Seite einen gestalteten Platzhalter.
  vsl: {
    src: "", // z. B. "/video/vsl.mp4" (selbst gehostet, damit ohne Einwilligung nichts an Dritte geht)
    poster: "", // Standbild des Videos, z. B. "/video/vsl-poster.webp"
    title: "Kurz erklärt: So gewinnst du Zeit mit KI",
    play: "Video abspielen",
    placeholder: "Video folgt",
  },
  done: "erledigt",
  counter: "Zeit gewonnen",
  // rein illustrativ, Minuten je erledigtem Kärtchen
  minutes: [45, 20, 30, 15, 40, 20, 35, 25],
};

export const chaos = {
  beats: [
    {
      label: "Das Problem",
      title: "Jeden Tag frisst Kleinkram deine Zeit.",
      text: "E-Mails sortieren, Angebote tippen, Daten von einem Programm ins andere kopieren. Nachfassen, suchen, abheften. Das kostet dein Team jede Woche viele Stunden.",
    },
    {
      label: "",
      title: ["Diese Arbeit ist wichtig.", "Aber sie ist immer gleich."],
      text: "Und genau solche Aufgaben kann eine KI heute übernehmen.",
    },
    {
      label: "Die Lösung",
      title: "Wir bauen Helfer, die das für dich erledigen.",
      text: "Die KI arbeitet im Hintergrund, rund um die Uhr. Dein Team gibt die Richtung vor, die Helfer erledigen den Rest.",
    },
  ],
  // ZUSATZ (Beschriftung der gezeichneten Szene „Der Posteingang, der sich selbst leert“, rein illustrativ)
  scene: {
    alt: "Illustration: Ein Posteingang füllt sich mit Anfragen, Rechnungen, Rückrufen und Terminen. Die Einträge ordnen sich in vier immer gleiche Gruppen und werden nacheinander abgehakt, bis nichts mehr offen ist.",
    inbox: "Posteingang",
    today: "Heute",
    unread: "ungelesen",
    done: "Alles erledigt",
    doneLine: "Heute erledigt von deinen Helfern",
    doneShort: "erledigt",
    // Zusammenfassung am Ende (mobil als eine einzige Mitteilung)
    helpers: "Deine Helfer",
    now: "jetzt",
    total: 148,
    start: 12,
    // Gruppen: Anzahlen ergeben zusammen die 148 aus dem Zähler
    groups: [
      { name: "Angebote", count: 21 },
      { name: "E-Mails", count: 64 },
      { name: "Daten abtippen", count: 38 },
      { name: "Termine", count: 25 },
    ],
    // in Eingangsreihenfolge; g = Gruppe
    items: [
      { g: 1, title: "Rückruf erbeten", from: "Telefonnotiz", time: "07:41" },
      { g: 2, title: "Rechnung 2026-114 prüfen", from: "Buchhaltung", time: "08:12" },
      { g: 0, title: "Anfrage: Terrassendach", from: "Kontaktformular", time: "08:46" },
      { g: 3, title: "Termin verschieben?", from: "Kunde", time: "09:31" },
      { g: 2, title: "Lieferschein abtippen", from: "Lager", time: "10:14" },
      { g: 1, title: "Bewerbung eingegangen", from: "Karriere", time: "11:02" },
      { g: 0, title: "Preisanfrage Wartung", from: "E-Mail", time: "11:47" },
      { g: 3, title: "Besichtigung bestätigen", from: "Außendienst", time: "12:36" },
      { g: 2, title: "Preisliste aktualisieren", from: "Einkauf", time: "13:28" },
      { g: 1, title: "Mahnung vorbereiten", from: "Buchhaltung", time: "14:15" },
      { g: 0, title: "Angebot nachfassen", from: "Erinnerung", time: "15:09" },
      { g: 3, title: "Aufmaß vor Ort planen", from: "Kalender", time: "16:02" },
    ],
    toasts: [
      { g: 0, title: "Neue Anfrage", sub: "Kontaktformular · jetzt" },
      { g: 1, title: "4 neue E-Mails", sub: "Posteingang · jetzt" },
      { g: 3, title: "Erinnerung: Rückruf", sub: "Kalender · jetzt" },
    ],
  },
};

export const schalter = {
  label: "Beispiele aus dem Alltag",
  title: "So fühlt sich dein Alltag mit _KI_ an.",
  off: "Ohne KI",
  on: "Mit KI",
  switchLabel: "Ansicht umschalten zwischen Ohne KI und Mit KI", // ZUSATZ (Screenreader)
  cards: [
    {
      id: "angebote",
      title: "Angebote",
      off: "Anfrage lesen, Preise suchen, Angebot tippen. Oft geht dafür ein ganzer Tag drauf.",
      on: "Die KI kennt deine Preise und Texte und baut das Angebot in 30 Minuten.",
      kpiOff: "1 Tag",
      kpiOn: "30 Min.",
    },
    {
      id: "emails",
      title: "E-Mails",
      off: "Jede Anfrage wird von Hand gelesen, sortiert und beantwortet.",
      on: "Die KI sortiert, schreibt die Antwort vor und legt sie dir zur Freigabe hin.",
      kpiOff: "von Hand",
      kpiOn: "Entwurf sofort da",
    },
    {
      id: "wissen",
      title: "Wissen",
      off: "Das Wissen steckt in Köpfen und Ordnern. Wer etwas sucht, fragt herum.",
      on: "Dein KI-Wissensspeicher beantwortet Fragen deines Teams in Sekunden, mit Quelle.",
      kpiOff: "herumfragen",
      kpiOn: "Antwort in Sekunden",
    },
    {
      id: "kunden",
      title: "Kundendaten",
      off: "Zettel, Tabellen, Postfach. Jede Anfrage wird abgetippt.",
      on: "Jede Anfrage landet von allein in deiner Kundenliste, mit Erinnerung zum Nachfassen.",
      kpiOff: "abtippen",
      kpiOn: "läuft von allein",
    },
  ],
  note: "Das sind nur Beispiele. Welche Helfer sich bei dir am meisten lohnen, steht in deinem Masterplan.",
  // ZUSATZ: Vormerken für das Formular (Kachelnamen exakt wie abschluss.step1.tiles)
  kenne: "Das kenne ich",
  vorgemerkt: "Vorgemerkt",
  hinweis: "Im Formular vorgemerkt",
  kachel: { angebote: "Angebote schreiben", emails: "E-Mails beantworten", wissen: "Wissen suchen", kunden: "Daten abtippen" } as Record<string, string>,
  karten: "Beispiele, zum Wischen", // ZUSATZ (Screenreader-Name der wischbaren Kartenreihe)
};

// ZUSATZ (30.09.2026, Wunsch Lukas: klarer zeigen, was wir alles anbieten).
// Grundlage: Leistungen der alten Seite (KI-Kacheln, Corporate LLM, Automatisierungen, Voice Agents) und kontext/firma.md.
export const loesungen = {
  label: "Unsere Lösungen",
  title: "Das alles kann KI in deinem Betrieb _übernehmen_.",
  text: "Jeder Betrieb ist anders. Deshalb bauen wir genau die Helfer, die bei dir am meisten Zeit sparen. Das sind die häufigsten.",
  groups: [
    {
      id: "wissen",
      title: "Wissen",
      items: [
        { id: "wissensmanagement", title: "KI-Wissensmanagement", text: "Eine KI, die alles über deinen Betrieb weiß. Dein Team fragt, sie antwortet in Sekunden, mit Quelle." },
        { id: "webchat", title: "KI-Chat auf deiner Webseite", text: "Beantwortet Fragen deiner Kunden rund um die Uhr und nimmt Anfragen direkt auf." },
      ],
    },
    {
      id: "kommunikation",
      title: "Kommunikation",
      items: [
        { id: "email", title: "E-Mail-Assistent", text: "Sortiert deinen Posteingang, schreibt Antworten vor und legt sie dir zur Freigabe hin." },
        { id: "telefon", title: "KI-Telefonassistent", text: "Nimmt Anrufe an, beantwortet einfache Fragen und trägt Termine ein, auch nach Feierabend." },
        { id: "termine", title: "Termine und Erinnerungen", text: "Termine buchen, bestätigen und erinnern, ganz ohne Hin und Her." },
      ],
    },
    {
      id: "ablaeufe",
      title: "Abläufe",
      items: [
        { id: "angebote", title: "Angebote automatisch", text: "Aus der Anfrage wird ein fertiges Angebot, in Minuten statt Stunden." },
        { id: "rechnungen", title: "Rechnungen und Belege", text: "Belege werden erfasst, Rechnungen erstellt und offene Beträge erinnert." },
        { id: "crm", title: "Anfragen und Kundenliste (CRM)", text: "Jede Anfrage landet sauber in deiner Kundenliste. Niemand wird vergessen." },
        { id: "dokumente", title: "Dokumente auslesen", text: "Lieferscheine, Formulare und PDFs werden gelesen und übertragen. Nie wieder abtippen." },
        { id: "berichte", title: "Berichte und Zahlen", text: "Deine Zahlen sammeln sich von allein zu einem fertigen Bericht." },
      ],
    },
  ],
  toolsLabel: "Verbunden mit Programmen, die du schon nutzt, zum Beispiel",
  tools: ["n8n", "Make", "Zapier", "OpenAI", "Anthropic", "Google", "HubSpot"],
  more: "Dein Zeitfresser ist nicht dabei? Im Workshop finden wir gemeinsam die passende Lösung.",
};

export const ergebnisse = {
  label: "Ergebnisse",
  big: "35+",
  bigLabel: "umgesetzte Projekte",
  title: "Stunden, die unsere\u00a0Kunden _zurückbekommen_\u00a0haben.",
  builtLabel: "Was wir gebaut haben", // Beschriftung laut TEXTE.md
  cases: [
    {
      id: "estera",
      name: "Estera GmbH",
      branche: "Kapitalanlageimmobilien, München",
      built: "Eine neue Webseite, eine digitale Kundenverwaltung (CRM) und smarte Automatisierungen dahinter.",
      resultPrefix: "bis zu ",
      resultNumber: 160,
      resultSuffix: " Std.",
      resultText: "bis zu 160 Std.",
      resultSub: "pro Woche gespart",
      translated: "So viel Arbeit wie vier Vollzeitstellen.",
      link: { label: "estera.immobilien", href: "https://estera.immobilien" },
      image: "/referenzen/estera-1600.webp",
      alt: "Startseite von estera.immobilien", // ZUSATZ (Alt-Text)
    },
    {
      id: "fuchs",
      name: "Fuchs Pools",
      branche: "Poolbau aus Niederbayern",
      built: "Eine neue Webseite, automatische Angebotserstellung und automatisiertes Marketing.",
      resultPrefix: "+",
      resultNumber: 15,
      resultSuffix: " Std.",
      resultText: "+15 Std.",
      resultSub: "pro Woche gespart",
      translated: "Fast zwei volle Arbeitstage, jede Woche.",
      link: { label: "fuchspools.com", href: "https://fuchspools.com" },
      image: "/referenzen/fuchs-1600.webp",
      alt: "Startseite von fuchspools.com", // ZUSATZ (Alt-Text)
    },
    {
      // TODO Referenz folgt: Name, Branche, Screenshot und Link nachtragen
      id: "platzhalter",
      name: "Referenz folgt",
      branche: "",
      built: "Automatische Angebotserstellung mit einem KI-Wissensspeicher.",
      resultPrefix: "",
      resultNumber: 0,
      resultSuffix: "",
      resultText: "1 Tag → 30 Min.",
      resultSub: "pro Angebot",
      translated: "Sechzehnmal schneller als vorher.",
      link: null,
      image: null,
      alt: "",
    },
  ],
  ctaLine: "Was ist bei dir möglich? Das finden wir gemeinsam heraus.",
  newWindow: "öffnet in neuem Fenster", // ZUSATZ (Screenreader)
};

export const geschenk = {
  label: "Dein Geschenk",
  title: ["Bevor wir über Geld reden, bekommst du einen Plan.", "*Geschenkt.*"],
  text: "Nach dem kostenlosen Workshop erarbeiten wir innerhalb von 48 Stunden deinen persönlichen KI-Masterplan. Er gehört dir, egal wie du dich danach entscheidest.",
  points: [
    {
      title: "Deine 5 bis 10 größten Zeitfresser",
      text: "Schwarz auf weiß, wo in deinem Betrieb jede Woche Zeit verloren geht.",
    },
    {
      title: "Die 3 Automatisierungen mit dem größten Hebel",
      text: "Wo du mit dem wenigsten Aufwand am meisten Zeit oder Geld sparst.",
    },
    {
      title: "Der Lösungsweg für jede davon",
      text: "Verständlich erklärt, welche Werkzeuge es braucht und wie man vorgeht.",
    },
    {
      title: "Die Besprechung im zweiten Termin",
      text: "Wir gehen alles gemeinsam durch und beantworten deine Fragen.",
    },
  ],
  doc: {
    coverTitle: "KI-Masterplan",
    coverSub: "für deinen Betrieb",
    coverBy: "erstellt von SvH Consulting",
    sample: "Beispiel",
    pageZeitfresser: "Zeitfresser",
    pageTop3: "Top 3",
    pageWeg: "Lösungsweg",
    bars: ["Angebote", "E-Mails", "Abtippen", "Suchen", "Nachfassen", "Berichte"],
  },
  stamp: "0 €",
  whyTitle: "Warum wir das verschenken", // geschütztes Leerzeichen: „verschenken“ nie allein in der Zeile (Safari)
  whyText:
    "Weil KI erst dann Sinn ergibt, wenn man sieht, was sie im eigenen Betrieb bewirkt. Wir zeigen es dir lieber, als es zu versprechen. Gefällt dir der Plan, setzen wir ihn gern mit dir um. Setzt du ihn lieber selbst um, ist das völlig in Ordnung. Den Plan behältst du so oder so.", // geschützte Leerzeichen: nie „oder so.“ allein in der letzten Zeile
};

export const spielzug = {
  label: "So läuft es ab",
  title: ["Vier Schritte zu mehr Zeit.", "Die ersten drei kosten _nichts_."], // geschütztes Leerzeichen: „nichts.“ nie allein (Safari)
  steps: [
    {
      title: "Kostenloser KI-Workshop",
      text: "30 bis 45 Minuten. Du erzählst, wie dein Betrieb arbeitet. Gemeinsam finden wir deine 5 bis 10 größten Zeitfresser.", // geschützte Leerzeichen: Zahlenspannen nie getrennt
      tag: "0 €",
    },
    {
      title: "Dein KI-Masterplan in 48 Stunden",
      text: "Wir rechnen durch, was sich lohnt, und schreiben dir die 3 besten Automatisierungen mit Lösungsweg auf.",
      tag: "0 €",
    },
    {
      title: "Gemeinsam besprechen",
      text: "Im zweiten Termin gehen wir den Plan durch. Danach entscheidest du in Ruhe, ob du selbst loslegst oder mit uns.",
      tag: "0 €",
    },
    {
      title: "Umsetzen und Zeit gewinnen",
      text: "Wir planen, bauen und testen die Helfer und zeigen deinem Team, wie alles funktioniert. Ab dann gewinnst du jede Woche Zeit.",
      tag: "mit Geld-zurück-Garantie",
    },
  ],
  forkSelf: { title: "Selbst umsetzen", text: "Der Plan gehört dir." },
  forkUs: "Mit uns umsetzen",
  bracket: "Bis hierhin 0 € und völlig unverbindlich",
  goal: "Tor! Zeit gewonnen.",
  stepWord: "Schritt", // ZUSATZ (Nummerierung „Schritt 1“)
};

export const garantie = {
  label: "Unsere Garantie",
  title: ["Keine Zeit gespart? _Geld zurück._", "Das Risiko tragen wir, nicht du."],
  text: "Wir sind von unserer Arbeit überzeugt. Spart dir unsere Automatisierung nicht die vereinbarte Zeit oder das vereinbarte Geld, bekommst du dein Geld zurück.",
  // Siegel: Ringschrift läuft um das SvH-Monogramm
  seal: "Geld-zurück-Garantie · schriftlich vereinbart · ",
  steps: [
    { title: "Ziel festlegen", text: "Vor dem Start schreiben wir gemeinsam auf, wie viel Zeit oder Geld die Automatisierung sparen soll." },
    { title: "Umsetzen und messen", text: "Wir bauen die Lösung und messen das Ergebnis gemeinsam mit dir." },
    { title: "Ziel verfehlt?", text: "Dann bekommst du dein Geld zurück. So steht es in deinem Angebot." },
  ],
  small: "Was „vereinbart“ genau heißt, legen wir vor dem Start gemeinsam und schriftlich fest.",
};

export const team = {
  label: "Wer dahintersteckt",
  title: "Zwei Gründer aus Bayern, die KI _verständlich_ machen.",
  text: "Wir sind Lukas Sehorz und Jannik vom Hofe. Wir machen KI so greifbar, dass jeder im Betrieb sie versteht und gern damit arbeitet. Du hast bei uns feste Ansprechpartner, die deinen Betrieb kennen.",
  people: [
    { name: "Lukas Sehorz", role: "Gründer", initials: "LS" },
    { name: "Jannik vom Hofe", role: "Gründer", initials: "JvH" },
  ],
  video: "Jannik erklärt auf YouTube, was KI heute für Betriebe kann.",
  videoCta: "Video ansehen",
};

export const fragen = {
  label: "Fragen",
  title: "Was Unternehmer uns vorher fragen.",
  items: [
    {
      q: "Was kostet mich der Workshop?",
      a: "Nichts. Der Workshop, der KI-Masterplan und die Besprechung sind kostenlos, und du gehst dabei keine Verpflichtung ein.",
    },
    {
      q: "Wo ist der Haken?",
      a: "Es gibt keinen. Wir verdienen erst dann Geld, wenn du dich entscheidest, den Plan mit uns umzusetzen. Wenn nicht, hast du trotzdem einen fertigen Plan in der Hand.",
    },
    {
      q: "Wir kennen uns mit KI gar nicht aus. Ist das ein Problem?",
      a: "Im Gegenteil, genau dafür sind wir da. Wir erklären alles in normaler Sprache und zeigen deinem Team Schritt für Schritt, wie die Helfer funktionieren.",
    },
    {
      q: "Lohnt sich das auch für kleinere Betriebe?",
      a: "Ja. Gerade dort fällt jede gewonnene Stunde auf. Im Workshop sehen wir gemeinsam, ob und wo es sich für dich rechnet.",
    },
    {
      q: "Was passiert mit unseren Daten?",
      a: "Das besprechen wir offen im Workshop. Wir wählen Werkzeuge, die zu deinen Anforderungen an den Datenschutz passen, und bauen nur, was du verstehst und freigibst.",
    },
    {
      q: "Wie lange dauert die Umsetzung?",
      a: "Das hängt davon ab, was wir bauen. Im Masterplan steht für jede Automatisierung, wie viel Aufwand sie macht. So weißt du vorher, woran du bist.",
    },
    {
      q: "Wie funktioniert die Geld-zurück-Garantie?",
      a: "Vor dem Start legen wir gemeinsam schriftlich fest, wie viel Zeit oder Geld die Umsetzung sparen soll. Wird das Ziel verfehlt, bekommst du dein Geld zurück. Die genauen Bedingungen stehen in deinem Angebot.",
    },
    {
      q: "Sind wir danach von euch abhängig?",
      a: "Alles, was wir bauen, schreiben wir auf und übergeben es an dein Team. Du kannst jederzeit selbst weitermachen.",
    },
  ],
};

export const abschluss = {
  label: "Dein nächster Schritt",
  title: "Hol dir deine Zeit *zurück*.",
  text: "Sichere dir deinen kostenlosen KI-Workshop. 48 Stunden danach hältst du deinen KI-Masterplan in der Hand.",
  // ZUSATZ (Zeile neben dem Masterplan-Deckblatt am Formular)
  gift: { title: "Dein KI-Masterplan", when: "48 Stunden nach dem Workshop", price: "0 €" },
  stepOf: (n: number) => `Schritt ${n} von 3`,
  step1: {
    title: "Was frisst bei dir am meisten Zeit?",
    hint: "Mehrfachauswahl",
    vorgemerkt: "Aus dem Schalter vorgemerkt", // ZUSATZ (Hinweis, wenn Kacheln im Schalter vorgemerkt wurden)
    tiles: [
      "Angebote schreiben",
      "E-Mails beantworten",
      "Daten abtippen",
      "Rechnungen und Belege",
      "Termine koordinieren",
      "Kunden nachfassen",
      "Wissen suchen",
      "Berichte erstellen",
      "Bewerbungen sichten",
      "Etwas anderes",
    ],
    slider: "Wie viele Stunden pro Woche kostet das dein Team ungefähr?",
    calc: (h: number) => {
      const year = h * 52;
      const weeks = Math.round(year / 40);
      return { year, weeks };
    },
    calcBefore: "Grob gerechnet sind das ",
    calcMid: " Stunden im Jahr. So viel wie ",
    calcAfter: " volle Arbeitswochen.",
    unit: "Std. pro Woche", // ZUSATZ (Einheit am Regler)
  },
  step2: {
    title: "Erzähl kurz von deinem Betrieb",
    question: "Wie viele Mitarbeiter hat dein Betrieb?",
    sizes: ["1 bis 9", "10 bis 29", "30 bis 80", "mehr als 80"],
    industry: "Branche",
  },
  step3: {
    title: "Wohin dürfen wir uns melden?",
    name: "Dein Name",
    company: "Firma",
    email: "E-Mail",
    phone: "Telefon",
    message: "Möchtest du uns noch etwas sagen?",
    consentBefore: "Ich bin einverstanden, dass SvH Consulting meine Angaben zur Bearbeitung der Anfrage verwendet. Mehr dazu in der ",
    consentLink: "Datenschutzerklärung",
    consentAfter: ".",
  },
  optional: "optional",
  next: "Weiter",
  back: "Zurück",
  submit: "Kostenlosen KI-Workshop sichern",
  sending: "Wird gesendet", // ZUSATZ (alte Seite)
  below: "Kostenlos · unverbindlich · deine Angaben bleiben bei uns",
  success: (first: string) => (first ? `Danke, ${first}! Deine Anfrage ist bei uns.` : "Danke! Deine Anfrage ist bei uns."),
  // Seit Runde 5 nicht mehr angezeigt: Schritt 1 von „danach“ sagt dasselbe (sonst doppelt)
  successText: "Wir melden uns persönlich bei dir, um einen Termin für deinen KI-Workshop zu finden.",
  // ZUSATZ: nächste Schritte unter der Erfolgsmeldung
  danach: {
    title: "So geht es weiter",
    steps: [
      "Wir melden uns persönlich, um einen Termin zu finden.",
      "Im kostenlosen Workshop finden wir deine größten Zeitfresser.",
      "48 Stunden danach hältst du deinen KI-Masterplan in der Hand.",
    ],
  },
  errorBefore: "Das hat leider nicht geklappt. Ruf uns gern direkt an unter ",
  errorMid: " oder schreib an ",
  errorAfter: ".",
  // ZUSATZ: Hinweis ohne JavaScript (danach Telefon, errorMid, E-Mail, errorAfter)
  noscriptBefore: "Das Formular lässt sich ohne JavaScript nicht absenden. Ruf uns gern direkt an unter ",
  // ZUSATZ (alte Seite): erscheint, wenn der Versand über die Seite noch nicht eingerichtet ist
  fallback: "Dein E-Mail-Programm öffnet sich mit deiner Nachricht an uns. Du musst sie nur noch abschicken.",
  errors: {
    // ZUSATZ: freundliche Hinweise der Formularprüfung
    tasks: "Bitte wähle mindestens eine Aufgabe aus.",
    size: "Bitte wähle die Größe deines Betriebs.",
    name: "Bitte gib deinen Namen an.",
    company: "Bitte gib deine Firma an.",
    email: "Bitte gib deine E-Mail-Adresse an.",
    emailInvalid: "Diese E-Mail-Adresse sieht unvollständig aus.",
    consent: "Bitte bestätige kurz dein Einverständnis.",
  },
  direct: {
    title: "Lieber direkt sprechen?",
    hours: "Montag bis Sonntag von 8 bis 21 Uhr",
  },
  mail: {
    brand: "SvH Consulting",
    title: "Neue Anfrage für den KI-Workshop",
    subject: "KI-Workshop-Anfrage von",
    none: "keine Angabe",
    replyNote: "Antworte einfach auf diese E-Mail, die Antwort geht an",
    // ZUSATZ (nur in der Mail an uns): Hochrechnung und Nachweis der Einwilligung
    yearValue: (year: string, weeks: string) => `${year} Stunden, so viel wie ${weeks} volle Arbeitswochen`,
    consentLine: "Einwilligung zur Bearbeitung der Anfrage erteilt am",
    labels: {
      tasks: "Zeitfresser",
      hours: "Stunden pro Woche",
      year: "Hochgerechnet im Jahr",
      employees: "Mitarbeiter",
      industry: "Branche",
      name: "Name",
      company: "Firma",
      email: "E-Mail",
      phone: "Telefon",
      message: "Nachricht",
    },
  },
};

export const footer = {
  claim: "Wir stellen die KI auf, du gewinnst die Zeit.",
  contactTitle: "Kontakt", // ZUSATZ (Spaltentitel)
  linksTitle: "Seiten", // ZUSATZ (Spaltentitel)
  links: [
    { label: "Aktuelles", href: "/aktuelles" },
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "AGB", href: "/agb" },
  ],
  consent: "Cookie-Einstellungen",
  copyright: "© 2026 SvH Consulting · Sehorz Lukas, vom Hofe Jannik GbR",
  watermark: "CONSULTING",
};

export const aktuelles = {
  meta: {
    title: "Aktuelles",
    description:
      "Jannik zeigt auf seinem Kanal, was in der KI gerade passiert und was davon für einen Betrieb wirklich zählt. Die neuesten Videos stehen hier.",
  },
  label: "Aktuelles",
  title: "Was sich in der KI gerade _bewegt_.",
  text: "Jannik zeigt auf seinem Kanal, was in der KI gerade passiert und was davon für einen Betrieb wirklich zählt. Die neuesten Videos stehen hier.",
  hint: "Ein Klick öffnet das Video auf YouTube in einem neuen Fenster.",
  channel: { label: "Alle Videos auf YouTube", href: "https://www.youtube.com/@jannikvomhofe" },
  watch: "Video ansehen", // alte Seite
  latest: "Neuestes Video", // ZUSATZ (Beschriftung)
  // Liste übernommen aus der alten Seite (copy.ts Zeile 332 ff.)
  videos: [
    {
      id: "neS8seYIg10",
      titel: "Das einzige KI-Video, das DU als CEO sehen musst | Top 9 aktuelle Praxis-Use Cases",
      datum: "16. September 2026",
      datumIso: "2026-09-16",
      body: "Neun KI-Anwendungen aus echten Projekten, von der Buchhaltung bis zum Angebot. Welche davon bringt einem Betrieb am meisten?",
      href: "https://www.youtube.com/watch?v=neS8seYIg10",
      bild: "/aktuelles/neS8seYIg10.webp",
      alt: "Vorschaubild des Videos über neun KI-Anwendungen aus der Praxis",
    },
    {
      id: "FS5eb2cIzHE",
      titel: "Ohne DIESE KI-Anwendung hat dein Unternehmen keine ZUKUNFT...",
      datum: "2. September 2026",
      datumIso: "2026-09-02",
      body: "Was ein Corporate LLM ist, wie es das Wissen eines Betriebs an einen Ort holt und warum Betriebe ohne eigene KI-Strategie den Anschluss verlieren.",
      href: "https://www.youtube.com/watch?v=FS5eb2cIzHE",
      bild: "/aktuelles/FS5eb2cIzHE.webp",
      alt: "Vorschaubild des Videos über Corporate LLM",
    },
    {
      id: "ATlHA9p3zXc",
      titel: "Der TEUERSTE Fehler deutscher Firmen ...",
      datum: "27. August 2026",
      datumIso: "2026-08-27",
      body: "Warum die meisten KI-Vorhaben im Mittelstand nicht am Modell scheitern, sondern an etwas ganz anderem.",
      href: "https://www.youtube.com/watch?v=ATlHA9p3zXc",
      bild: "/aktuelles/ATlHA9p3zXc.webp",
      alt: "Vorschaubild des Videos über gescheiterte KI-Projekte",
    },
    {
      id: "e6zwbX6KXnU",
      titel: "A Week in the Life of a 23 year old AI Agency Owner",
      datum: "18. August 2026",
      datumIso: "2026-08-18",
      body: "Ein Blick hinter die Kulissen. Eine Woche im Alltag einer jungen KI-Agentur.",
      href: "https://www.youtube.com/watch?v=e6zwbX6KXnU",
      bild: "/aktuelles/e6zwbX6KXnU.webp",
      alt: "Vorschaubild des Videos über eine Arbeitswoche in der Agentur",
    },
  ],
};

// ZUSATZ: Einwilligung, Texte von der alten Seite übernommen
export const einwilligung = {
  titel: "Dürfen wir mitzählen?",
  // gekürzt gegenüber der alten Seite, damit das Feld Knopf und Überschrift nicht verdeckt
  body: "Mit deiner Zustimmung zählen wir über Google, welche Seiten gelesen werden. Dabei wird etwas auf deinem Gerät gespeichert. Ohne Zustimmung passiert davon nichts.",
  mehr: "Einzelheiten stehen in der Datenschutzerklärung.",
  // Kurzfassung für niedrige Bildschirme (kompakte Leiste)
  kurz: "Dürfen wir mit Google messen, welche Seiten gelesen werden?",
  kurzLink: "Datenschutz",
  mehrHref: "/datenschutz",
  alle: "Einverstanden",
  notwendig: "Nur das Nötige",
};

// ZUSATZ: Seite nicht gefunden, Texte von der alten Seite
export const notFound = {
  label: "404",
  title: "Diese Adresse führt ins _Leere._",
  lead: "Vielleicht ist die Adresse falsch geschrieben, oder die Seite ist umgezogen. Von hier aus findest du zurück.",
  home: "Zur Startseite",
  metaTitle: "Seite nicht gefunden", // ZUSATZ (Seitentitel, alte Seite)
};

export const legal = {
  label: "Rechtliches",
  note: "Dieser Text ersetzt keine Rechtsberatung.",
  toc: "Inhalt", // ZUSATZ (Inhaltsverzeichnis der Rechtsseiten)
};
