import Hero from "@/components/sections/Hero";
import ChaosRuhe from "@/components/sections/ChaosRuhe";
import Schalter from "@/components/sections/Schalter";
import Ergebnisse from "@/components/sections/Ergebnisse";
import Geschenk from "@/components/sections/Geschenk";
import Spielzug from "@/components/sections/Spielzug";
import Garantie from "@/components/sections/Garantie";
import Team from "@/components/sections/Team";
import Fragen from "@/components/sections/Fragen";
import Abschluss from "@/components/sections/Abschluss";

// Reihenfolge laut KONZEPT.md. Jede Sektion liegt in einer eigenen Datei mit eigener CSS-Datei unter app/styles/.
export default function Home() {
  return (
    <main id="inhalt">
      <Hero />
      <ChaosRuhe />
      <Schalter />
      <Ergebnisse />
      <Geschenk />
      <Spielzug />
      <Garantie />
      <Team />
      <Fragen />
      <Abschluss />
    </main>
  );
}
