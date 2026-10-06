/*
 * Texte der Startseite (ehemals „Variante B“, seit 06.10.2026 die einzige Seite).
 * Gemeinsame Texte (Knopf, Leiste, Aktuelles, Rechtsseiten, 404, Formular-Mail) stehen in app/copy.ts.
 * Leitlinie: so einfach, dass es ein 12-Jähriger und ein 55-jähriger Geschäftsführer verstehen.
 * Aufbau: Problem (Schmerz) → Vorteile (Gewinn) → Leistungen → Kunden (Beweis) → Anmeldung.
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

// Reihenfolge wie auf der Seite: Vorteile vor Leistungen
export const navB: { links: NavLink[] } = {
  links: [
    { label: "Vorteile", href: "#vorteile", id: "vorteile" },
    {
      label: "Leistungen",
      href: "#leistungen",
      id: "leistungen",
      sub: [
        { label: "KI-Workshop", text: "Der kostenlose Start für deinen Betrieb", href: "#workshop" },
        { label: "KI-Automatisierung", text: "Arbeit, die sich von allein erledigt", href: "#automatisierung" },
        { label: "KI-Assistenten", text: "Telefon, E-Mail und Chat rund um die Uhr", href: "#assistenten" },
        { label: "KI-Wissensmanagement", text: "Eine KI, die alles über deinen Betrieb weiß", href: "#wissensmanagement" },
      ],
      foot: { label: "Alle Leistungen im Überblick", href: "#leistungen" },
    },
    { label: "Kunden", href: "#kunden", id: "kunden" },
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

// Unendlichkeitszeichen: vier Leistungen, die ineinander übergehen.
// Lage am Zeichen: 1 oben links, 2 unten rechts, 3 oben rechts, 4 unten links.
export const leistungenB = {
  titel: "Unsere _Leistungen_",
  text: "Vier Bausteine, die ineinandergreifen. Wir starten immer mit dem kostenlosen Workshop.",
  mehr: "Mehr erfahren",
  einfachLabel: "Einfach erklärt",
  teile: [
    { nr: 1, kurz: "KI-Workshop", titel: "KI-Workshop", text: "Wir finden gemeinsam heraus, wo KI in deinem Betrieb am meisten Zeit spart. Kostenlos.", href: "#workshop" },
    { nr: 2, kurz: "Automatisierung", titel: "KI-Automatisierung", text: "Angebote, Rechnungen und Daten erledigen sich von allein, wie am Fließband.", href: "#automatisierung" },
    { nr: 3, kurz: "Assistenten", titel: "KI-Assistenten", text: "Ein digitaler Kollege geht ans Telefon, beantwortet E-Mails und Chats, rund um die Uhr.", href: "#assistenten" },
    { nr: 4, kurz: "Wissen", titel: "KI-Wissensmanagement", text: "Eine KI, die alles über deinen Betrieb weiß und deinem Team in Sekunden antwortet.", href: "#wissensmanagement" },
  ],
};

// Workshop als Ablauf von oben nach unten (Angaben von Jannik, 04.10.2026)
export const workshopB = {
  titel: "Der kostenlose _KI-Workshop_",
  text: "Bevor wir irgendetwas bauen, verstehen wir deinen Betrieb. So läuft es ab, Schritt für Schritt.",
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

/* Beispiele: Jede Leistung zeigt zu jedem Punkt ein kleines Bild aus dem Alltag.
   Namen, Zahlen und Inhalte in den Bildern sind erfundene Beispiele und als solche gekennzeichnet. */
export const automatisierungB = {
  titel: "_KI-Automatisierung_",
  einfach: "Wie ein Fließband für deine Büroarbeit: Was du heute von Hand machst, läuft danach automatisch ab, ohne dass jemand danebensitzen muss.",
  punkte: [
    { id: "angebote", titel: "Angebote automatisch", text: "Aus der Anfrage wird in Minuten ein fertiges Angebot. Die KI kennt deine Preise und Texte und legt dir den Entwurf zur Freigabe hin." },
    { id: "rechnungen", titel: "Rechnungen und Belege", text: "Belege werden fotografiert, ausgelesen und verbucht. Offene Rechnungen werden automatisch erinnert." },
    { id: "anfragen", titel: "Anfragen und Kundenliste", text: "Jede Anfrage landet von allein in deiner Kundenliste, mit Erinnerung zum Nachfassen. Niemand wird vergessen." },
    { id: "dokumente", titel: "Dokumente auslesen", text: "Lieferscheine, Formulare und PDFs werden gelesen und die Daten übertragen. Nie wieder abtippen." },
    { id: "berichte", titel: "Berichte und Zahlen", text: "Deine wichtigsten Zahlen sammeln sich von allein zu einem fertigen Bericht, jeden Montag im Postfach." },
  ],
};

export const assistentenB = {
  titel: "_KI-Assistenten_",
  einfach: "Ein digitaler Kollege, der nie Feierabend macht: Er geht ans Telefon, bereitet E-Mails vor und beantwortet Fragen auf deiner Webseite. Auch nachts und am Wochenende.",
  punkte: [
    { id: "telefon", titel: "KI-Telefonassistent", text: "Nimmt Anrufe an, beantwortet einfache Fragen und trägt Termine ein, auch nach Feierabend." },
    { id: "email", titel: "E-Mail-Assistent", text: "Sortiert deinen Posteingang, schreibt Antworten vor und legt sie dir zur Freigabe hin." },
    { id: "chat", titel: "KI-Chat auf deiner Webseite", text: "Beantwortet Fragen deiner Kunden rund um die Uhr und nimmt Anfragen direkt auf." },
    { id: "termine", titel: "Termine und Erinnerungen", text: "Termine buchen, bestätigen und erinnern, ganz ohne Hin und Her." },
  ],
};

export const wissenB = {
  titel: "_KI-Wissensmanagement_",
  kurz: "Eine KI, die alles über deinen Betrieb weiß und deinem Team in Sekunden antwortet.",
  orteTitel: "Wo steckt das Wissen in deinem Betrieb heute?",
  orte: [
    { icon: "kopf", titel: "In den Köpfen", text: "Erfahrene Mitarbeiter wissen alles. Wenn sie gehen, geht das Wissen mit." },
    { icon: "ordner", titel: "In Dokumenten und Ordnern", text: "Handbücher, Preislisten, Anleitungen: abgelegt, aber keiner findet sie." },
    { icon: "laptop", titel: "Irgendwo auf dem Laptop", text: "Wichtige Dateien liegen bei Einzelnen. Für den Rest des Teams unsichtbar." },
    { icon: "mail", titel: "In alten E-Mails", text: "Absprachen und Lösungen stecken im Postfach und sind nach Wochen vergessen." },
  ],
  folge: "Die Folge: Wissen geht verloren, dieselben Fragen werden immer wieder gestellt, und jeder sucht jede Woche Stunden.",
  // OFFEN: „datenschutzkonform und rechtssicher“ muss für jedes Projekt zutreffen
  loesung: "Wir bündeln das Wissen deines Unternehmens an einem Ort. Datenschutzkonform und rechtssicher.",
  vorher: {
    label: "Vorher",
    frage: "Wo finde ich die Info zur Garantie?",
    orte: [
      { icon: "ordner", text: "Alter Ordner „Projekte 2019“" },
      { icon: "kopf", text: "Im Kopf von Petra aus dem Büro" },
      { icon: "mail", text: "E-Mail vom letzten Frühjahr" },
      { icon: "tabelle", text: "Excel „Kunden_neu_final2“" },
      { icon: "buch", text: "Irgendwo im Handbuch" },
      { icon: "notiz", text: "Notiz am Monitor" },
    ],
    unter: "Alles verstreut. Jeder sucht, keiner findet.",
  },
  nachher: {
    label: "Nachher",
    app: "Wissensspeicher",
    quellen: ["Handbücher", "Preislisten", "E-Mails", "Excel-Tabellen", "Notizen", "Anleitungen"],
    frage: "Wie lange gilt die Garantie auf unsere Terrassendächer?",
    antwort: "5 Jahre auf die Konstruktion, 2 Jahre auf bewegliche Teile wie Markisen.",
    quelle: "Quelle: Garantiebedingungen, Seite 2",
    unter: "Alles an einem Ort. Einfach fragen, sofort Antwort.",
  },
  beispiel: "Beispiel",
};

/* Kunden: echte Google-Bewertungen (Profil „SvH Consulting“, 5,0 Sterne, Stand 04.10.2026), wortgetreu.
   Zuordnung laut Jannik (04.10.2026). OFFEN: was bei Taxi Izi, Betthupferl und zGraniT RxyaL umgesetzt wurde.
   Bei Izzet Tüymen fehlt bewusst der Schlusssatz „Vielen Dank für deine Unterstützung! 🙌“ (klingt nach unserer Antwort). */
export type Bewertung = { name: string; firma: string; logo: string; href: string; sterne: number; datum: string; text: string; umgesetzt: string };

export const kundenB = {
  label: "Kunden",
  titel: "Was unsere Kunden _sagen_",
  text: "Echte Bewertungen von Google, und darunter, was wir für diese Betriebe gebaut haben.",
  schnitt: "5,0",
  anzahl: "5 Google-Bewertungen",
  profil: "https://www.google.com/maps/place/SvH+Consulting/@48.3285982,11.8226616,10z/data=!4m6!3m5!1s0x8eafb3c841f9a22f:0xc493185e015a3928!8m2!3d48.3285982!4d11.8226616!16s%2Fg%2F11nvctpln1",
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

// Zahnräder: KI treibt als großes Rad in der Mitte alle Bereiche des Betriebs an
export const zahnradB = {
  titel: "Spare dir systematisch Zeit und stelle deinen Betrieb _zukunftssicher_ auf.",
  text: "KI ist wie ein Motor in der Mitte deines Betriebs. Sie greift in jeden Bereich und treibt alle gleichzeitig an. Dreht sich das große Rad, dreht sich der ganze Betrieb mit.",
  punkte: [
    "Jeder Bereich gewinnt Zeit, nicht nur einer",
    "Alles greift ineinander, nichts wird doppelt gemacht",
    "Dein Betrieb ist bereit für das, was kommt",
  ],
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
