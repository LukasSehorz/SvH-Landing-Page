import { cta, hero } from "@/app/copy";
import Cta from "@/components/system/Cta";
import Rich from "@/components/system/Rich";
import HeroIntro from "./HeroIntro";
import HeroMachine from "./HeroMachine";

export default function Hero() {
  return (
    <section className="hero" id="start" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <div className="veil-a" />
        <div className="veil-b" />
        <div className="dots" />
      </div>

      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="label hero-eyebrow" data-hero-in="">
            {hero.eyebrow}
          </p>
          <h1 className="hero-title" id="hero-title">
            {hero.h1.map((line) => (
              <span className="hero-line" key={line}>
                <Rich text={line} manualScript />
              </span>
            ))}
          </h1>
          <p className="lead hero-text" data-hero-in="">
            {hero.text}
          </p>
          <div className="hero-actions" data-hero-in="">
            <Cta href="#termin">{cta.main}</Cta>
            <Cta href="#fahrplan" variant="ghost">
              {hero.secondary}
            </Cta>
          </div>
          <p className="hero-sub" data-hero-in="">
            {hero.sub}
          </p>
          <ul className="hero-proof" data-hero-in="">
            {hero.proof.map((p) => (
              <li key={p.big}>
                <strong>{p.big}</strong>
                <span>{p.small}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual" data-hero-in="">
          <HeroMachine />
        </div>
      </div>
      <HeroIntro />
    </section>
  );
}
