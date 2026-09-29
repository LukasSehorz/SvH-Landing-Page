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
    "Wir bauen digitale Helfer, die die immer gleiche Arbeit in Ihrem Betrieb übernehmen. Starten Sie mit einem kostenlosen KI-Workshop und Ihrem persönlichen KI-Masterplan.",
  ogAlt: "Wir stellen die KI auf. Sie gewinnen die Zeit.",
};

export const cta = {
  main: "Kostenlosen KI-Workshop sichern",
  nav: "Kostenloser KI-Workshop",
};

export const nav = {
  links: [
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
  h1: ["Wir stellen die KI auf.", "Sie *gewinnen* die Zeit."],
  text: "Wir bauen digitale Helfer für Ihren Betrieb. Sie schreiben Angebote, beantworten E-Mails und tragen Daten ein, ganz von allein. Ihr Team hat wieder Zeit für die Arbeit, die wirklich zählt.",
  sub: "30 bis 45 Minuten · danach Ihr KI-Masterplan geschenkt",
  secondary: "So läuft es ab",
  proof: [
    { big: "35+", small: "umgesetzte Projekte" },
    { big: "bis zu 160 Std.", small: "pro Woche gespart" },
    { big: "Geld zurück", small: "+ Kasten Bier, falls wir keine Zeit sparen" },
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
  done: "erledigt",
  counter: "Zeit gewonnen",
  // rein illustrativ, Minuten je erledigtem Kärtchen
  minutes: [45, 20, 30, 15, 40, 20, 35, 25],
};

export const chaos = {
  beats: [
    {
      label: "Das Problem",
      title: "Jeden Tag frisst Kleinkram Ihre Zeit.",
      text: "E-Mails sortieren, Angebote tippen, Daten von einem Programm ins andere kopieren. Nachfassen, suchen, abheften. Das kostet Ihr Team jede Woche viele Stunden.",
    },
    {
      label: "",
      title: "Diese Arbeit ist wichtig. Aber sie ist immer gleich.",
      text: "Und genau solche Aufgaben kann eine KI heute übernehmen.",
    },
    {
      label: "Die Lösung",
      title: "Wir bauen Helfer, die das für Sie erledigen.",
      text: "Die KI arbeitet im Hintergrund, rund um die Uhr. Ihr Team gibt die Richtung vor, die Helfer erledigen den Rest.",
    },
  ],
  altStart: "Ein überfüllter Schreibtisch am Abend mit Papierstapeln, Zetteln und einem leuchtenden Laptop", // ZUSATZ (Alt-Text)
  altEnd: "Derselbe Schreibtisch, aufgeräumt, nur noch Laptop und Tasse", // ZUSATZ (Alt-Text)
};

export const schalter = {
  label: "Beispiele aus dem Alltag",
  title: "So fühlt sich Ihr Alltag mit _KI_ an.",
  off: "Ohne KI",
  on: "Mit KI",
  switchLabel: "Ansicht umschalten zwischen Ohne KI und Mit KI", // ZUSATZ (Screenreader)
  cards: [
    {
      id: "angebote",
      title: "Angebote",
      off: "Anfrage lesen, Preise suchen, Angebot tippen. Oft geht dafür ein ganzer Tag drauf.",
      on: "Die KI kennt Ihre Preise und Texte und baut das Angebot in 30 Minuten.",
      kpiOff: "1 Tag",
      kpiOn: "30 Min.",
    },
    {
      id: "emails",
      title: "E-Mails",
      off: "Jede Anfrage wird von Hand gelesen, sortiert und beantwortet.",
      on: "Die KI sortiert, schreibt die Antwort vor und legt sie Ihnen zur Freigabe hin.",
      kpiOff: "von Hand",
      kpiOn: "Entwurf sofort da",
    },
    {
      id: "wissen",
      title: "Wissen",
      off: "Das Wissen steckt in Köpfen und Ordnern. Wer etwas sucht, fragt herum.",
      on: "Ihr KI-Wissensspeicher beantwortet Fragen Ihres Teams in Sekunden, mit Quelle.",
      kpiOff: "herumfragen",
      kpiOn: "Antwort in Sekunden",
    },
    {
      id: "kunden",
      title: "Kundendaten",
      off: "Zettel, Tabellen, Postfach. Jede Anfrage wird abgetippt.",
      on: "Jede Anfrage landet von allein im CRM, mit Erinnerung zum Nachfassen.",
      kpiOff: "abtippen",
      kpiOn: "läuft von allein",
    },
  ],
  note: "Das sind nur Beispiele. Welche Helfer sich bei Ihnen am meisten lohnen, steht in Ihrem Masterplan.",
};

export const ergebnisse = {
  label: "Ergebnisse",
  big: "35+",
  bigLabel: "umgesetzte Projekte",
  title: "Stunden, die unsere Kunden _zurückbekommen_ haben.",
  builtLabel: "Was wir gebaut haben", // Beschriftung laut TEXTE.md
  cases: [
    {
      id: "estera",
      name: "Estera GmbH",
      branche: "Kapitalanlageimmobilien, München",
      built: "Eine neue Webseite, ein CRM und smarte Automatisierungen dahinter.",
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
      built: "Automatische Angebotserstellung mit KI-Wissensmanagement.",
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
  ctaLine: "Was ist bei Ihnen möglich? Das finden wir gemeinsam heraus.",
  newWindow: "öffnet in neuem Fenster", // ZUSATZ (Screenreader)
};

export const geschenk = {
  label: "Ihr Geschenk",
  title: ["Bevor wir über Geld reden, bekommen Sie einen Plan.", "*Geschenkt.*"],
  text: "Nach dem kostenlosen Workshop erarbeiten wir innerhalb von 48 Stunden Ihren persönlichen KI-Masterplan. Er gehört Ihnen, egal wie Sie sich danach entscheiden.",
  points: [
    {
      title: "Ihre 5 bis 10 größten Zeitfresser",
      text: "Schwarz auf weiß, wo in Ihrem Betrieb jede Woche Zeit verloren geht.",
    },
    {
      title: "Die 3 Automatisierungen mit dem größten Hebel",
      text: "Wo Sie mit dem wenigsten Aufwand am meisten Zeit oder Geld sparen.",
    },
    {
      title: "Der Lösungsweg für jede davon",
      text: "Verständlich erklärt, welche Werkzeuge es braucht und wie man vorgeht.",
    },
    {
      title: "Die Besprechung im zweiten Termin",
      text: "Wir gehen alles gemeinsam durch und beantworten Ihre Fragen.",
    },
  ],
  doc: {
    coverTitle: "KI-Masterplan",
    coverSub: "für Ihren Betrieb",
    coverBy: "erstellt von SvH Consulting",
    sample: "Beispiel",
    pageZeitfresser: "Zeitfresser",
    pageTop3: "Top 3",
    pageWeg: "Lösungsweg",
    bars: ["Angebote", "E-Mails", "Abtippen", "Suchen", "Nachfassen", "Berichte"],
  },
  stamp: "0 €",
  whyTitle: "Warum wir das verschenken",
  whyText:
    "Weil KI erst dann Sinn ergibt, wenn man sieht, was sie im eigenen Betrieb bewirkt. Wir zeigen es Ihnen lieber, als es zu versprechen. Gefällt Ihnen der Plan, setzen wir ihn gern mit Ihnen um. Setzen Sie ihn lieber selbst um, ist das völlig in Ordnung. Den Plan behalten Sie so oder so.",
};

export const spielzug = {
  label: "So läuft es ab",
  title: ["Vier Schritte zu mehr Zeit.", "Die ersten drei kosten _nichts_."],
  steps: [
    {
      title: "Kostenloser KI-Workshop",
      text: "30 bis 45 Minuten. Sie erzählen, wie Ihr Betrieb arbeitet. Gemeinsam finden wir Ihre 5 bis 10 größten Zeitfresser.",
      tag: "0 €",
    },
    {
      title: "Ihr KI-Masterplan in 48 Stunden",
      text: "Wir rechnen durch, was sich lohnt, und schreiben Ihnen die 3 besten Automatisierungen mit Lösungsweg auf.",
      tag: "0 €",
    },
    {
      title: "Gemeinsam besprechen",
      text: "Im zweiten Termin gehen wir den Plan durch. Danach entscheiden Sie in Ruhe, ob Sie selbst loslegen oder mit uns.",
      tag: "0 €",
    },
    {
      title: "Umsetzen und Zeit gewinnen",
      text: "Wir planen, bauen und testen die Helfer und zeigen Ihrem Team, wie alles funktioniert. Ab dann gewinnen Sie jede Woche Zeit.",
      tag: "mit Geld-zurück-Garantie",
    },
  ],
  forkSelf: { title: "Selbst umsetzen", text: "Der Plan gehört Ihnen." },
  forkUs: "Mit uns umsetzen",
  bracket: "Bis hierhin 0 € und völlig unverbindlich",
  goal: "Tor! Zeit gewonnen.",
  stepWord: "Schritt", // ZUSATZ (Nummerierung „Schritt 1“)
};

export const garantie = {
  title: ["Keine Zeit gespart? _Geld zurück._", "Und der Kasten Bier geht auf uns."],
  text: "Wir sind von unserer Arbeit überzeugt. Deshalb tragen wir das Risiko und nicht Sie. Spart Ihnen unsere Umsetzung nicht die vereinbarte Zeit, bekommen Sie Ihr Geld zurück. Und der Kasten Bier geht obendrein auf uns.",
  small: "Was „vereinbarte Zeit“ genau heißt, legen wir vor dem Start gemeinsam und schriftlich fest.",
  alt: "Ein Kasten Bier im blauvioletten Gegenlicht", // ZUSATZ (Alt-Text)
};

export const team = {
  label: "Wer dahintersteckt",
  title: "Zwei Gründer aus Bayern, die KI _verständlich_ machen.",
  text: "Wir sind Lukas Sehorz und Jannik vom Hofe. Wir machen KI so greifbar, dass jeder im Betrieb sie versteht und gern damit arbeitet. Sie haben bei uns feste Ansprechpartner, die Ihren Betrieb kennen.",
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
      a: "Nichts. Der Workshop, der KI-Masterplan und die Besprechung sind kostenlos, und Sie gehen dabei keine Verpflichtung ein.",
    },
    {
      q: "Wo ist der Haken?",
      a: "Es gibt keinen. Wir verdienen erst dann Geld, wenn Sie sich entscheiden, den Plan mit uns umzusetzen. Wenn nicht, haben Sie trotzdem einen fertigen Plan in der Hand.",
    },
    {
      q: "Wir kennen uns mit KI gar nicht aus. Ist das ein Problem?",
      a: "Im Gegenteil, genau dafür sind wir da. Wir erklären alles in normaler Sprache und zeigen Ihrem Team Schritt für Schritt, wie die Helfer funktionieren.",
    },
    {
      q: "Lohnt sich das auch für kleinere Betriebe?",
      a: "Ja. Gerade dort fällt jede gewonnene Stunde auf. Im Workshop sehen wir gemeinsam, ob und wo es sich für Sie rechnet.",
    },
    {
      q: "Was passiert mit unseren Daten?",
      a: "Das besprechen wir offen im Workshop. Wir wählen Werkzeuge, die zu Ihren Anforderungen an den Datenschutz passen, und bauen nur, was Sie verstehen und freigeben.",
    },
    {
      q: "Wie lange dauert die Umsetzung?",
      a: "Das hängt davon ab, was wir bauen. Im Masterplan steht für jede Automatisierung, wie viel Aufwand sie macht. So wissen Sie vorher, woran Sie sind.",
    },
    {
      q: "Wie funktioniert die Geld-zurück-Garantie?",
      a: "Vor dem Start legen wir gemeinsam schriftlich fest, wie viel Zeit die Umsetzung sparen soll. Wird das Ziel verfehlt, bekommen Sie Ihr Geld zurück, und der Kasten Bier kommt obendrauf. Die genauen Bedingungen stehen in Ihrem Angebot.",
    },
    {
      q: "Sind wir danach von Ihnen abhängig?",
      a: "Alles, was wir bauen, schreiben wir auf und übergeben es an Ihr Team. Sie können jederzeit selbst weitermachen.",
    },
  ],
};

export const abschluss = {
  label: "Ihr nächster Schritt",
  title: "Holen Sie sich Ihre Zeit *zurück*.",
  text: "Sichern Sie sich Ihren kostenlosen KI-Workshop. 48 Stunden danach halten Sie Ihren KI-Masterplan in der Hand.",
  stepOf: (n: number) => `Schritt ${n} von 3`,
  step1: {
    title: "Was frisst bei Ihnen am meisten Zeit?",
    hint: "Mehrfachauswahl",
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
    slider: "Wie viele Stunden pro Woche kostet das Ihr Team ungefähr?",
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
    title: "Erzählen Sie kurz von Ihrem Betrieb",
    question: "Wie viele Mitarbeiter hat Ihr Betrieb?",
    sizes: ["1 bis 9", "10 bis 29", "30 bis 80", "mehr als 80"],
    industry: "Branche",
  },
  step3: {
    title: "Wohin dürfen wir uns melden?",
    name: "Ihr Name",
    company: "Firma",
    email: "E-Mail",
    phone: "Telefon",
    message: "Möchten Sie uns noch etwas sagen?",
    consentBefore: "Ich bin einverstanden, dass SvH Consulting meine Angaben zur Bearbeitung der Anfrage verwendet. Mehr dazu in der ",
    consentLink: "Datenschutzerklärung",
    consentAfter: ".",
  },
  optional: "optional",
  next: "Weiter",
  back: "Zurück",
  submit: "Kostenlosen KI-Workshop sichern",
  sending: "Wird gesendet", // ZUSATZ (alte Seite)
  below: "Kostenlos · unverbindlich · Ihre Angaben bleiben bei uns",
  success: (first: string) => (first ? `Danke, ${first}! Ihre Anfrage ist bei uns.` : "Danke! Ihre Anfrage ist bei uns."),
  successText: "Wir melden uns persönlich bei Ihnen, um einen Termin für Ihren KI-Workshop zu finden.",
  errorBefore: "Das hat leider nicht geklappt. Rufen Sie uns gern direkt an unter ",
  errorMid: " oder schreiben Sie an ",
  errorAfter: ".",
  // ZUSATZ (alte Seite): erscheint, wenn der Versand über die Seite noch nicht eingerichtet ist
  fallback: "Ihr E-Mail-Programm öffnet sich mit Ihrer Nachricht an uns. Sie müssen sie nur noch abschicken.",
  errors: {
    // ZUSATZ: freundliche Hinweise der Formularprüfung
    tasks: "Bitte wählen Sie mindestens eine Aufgabe aus.",
    size: "Bitte wählen Sie die Größe Ihres Betriebs.",
    name: "Bitte geben Sie Ihren Namen an.",
    company: "Bitte geben Sie Ihre Firma an.",
    email: "Bitte geben Sie Ihre E-Mail-Adresse an.",
    emailInvalid: "Diese E-Mail-Adresse sieht unvollständig aus.",
    consent: "Bitte bestätigen Sie kurz Ihr Einverständnis.",
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
    replyNote: "Antworten Sie einfach auf diese E-Mail, die Antwort geht an",
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
  claim: "Wir stellen die KI auf. Sie gewinnen die Zeit.",
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
  body: "Mit Ihrer Zustimmung zählen wir über Google, welche Seiten gelesen werden. Dabei wird etwas auf Ihrem Gerät gespeichert. Ohne Zustimmung passiert davon nichts.",
  mehr: "Einzelheiten stehen in der Datenschutzerklärung.",
  mehrHref: "/datenschutz",
  alle: "Einverstanden",
  notwendig: "Nur das Nötige",
};

// ZUSATZ: Seite nicht gefunden, Texte von der alten Seite
export const notFound = {
  label: "404",
  title: "Diese Adresse führt ins _Leere._",
  lead: "Vielleicht ist die Adresse falsch geschrieben, oder die Seite ist umgezogen. Von hier aus finden Sie zurück.",
  home: "Zur Startseite",
};

export const legal = {
  label: "Rechtliches",
  note: "Dieser Text ersetzt keine Rechtsberatung.",
};
