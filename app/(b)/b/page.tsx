import Hero from "@/components/b/Hero";
import TrustBar from "@/components/b/TrustBar";
import KundenLogos from "@/components/b/KundenLogos";
import Problem from "@/components/b/Problem";
import Unendlich from "@/components/b/Unendlich";
import { Assistenten, Automatisierung, Wissen, Workshop } from "@/components/b/Leistungen";
import Masterplan from "@/components/b/Masterplan";
import Zahnraeder from "@/components/b/Zahnraeder";
import Kunden from "@/components/b/Kunden";
import { Aktuelles, UeberUns } from "@/components/b/UeberUns";
import Naechster from "@/components/b/Naechster";
import Fragen from "@/components/b/Fragen";
import FormDialog from "@/components/b/FormDialog";

/* Variante B: Startseite. Aufbau: Versprechen → Beweis (Logos) → Problem und Vorteile →
   Leistungen → Zahnräder → Masterplan → Kunden → Gründer → Einblicke → nächster Schritt → Fragen.
   Alle Knöpfe „Kostenlosen KI-Workshop sichern“ öffnen die Anmeldung im Fenster (FormDialog). */
export default function HomeB() {
  return (
    <main id="inhalt">
      <Hero />
      <TrustBar />
      <KundenLogos />
      <Problem />
      <Unendlich />
      <Workshop />
      <Automatisierung />
      <Assistenten />
      <Wissen />
      <Zahnraeder />
      <Masterplan />
      <Kunden />
      <UeberUns />
      <Aktuelles />
      <Naechster />
      <Fragen />
      <FormDialog />
    </main>
  );
}
