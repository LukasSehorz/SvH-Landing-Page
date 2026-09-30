import { Fragment } from "react";
import { cta, geschenk, hero } from "@/app/copy";
import Cta from "@/components/system/Cta";
import Rich from "@/components/system/Rich";
import HeroMachine from "./HeroMachine";
import { Check } from "@/components/system/Icons";

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
          <p className="label hero-eyebrow" data-hero-in="" style={{ "--i": 0 } as React.CSSProperties}>
            {hero.eyebrow}
          </p>
          <h1 className="hero-title" id="hero-title">
            {hero.h1.map((line, i) => (
              <Fragment key={line}>
                {i > 0 ? " " : null}
                <span className="hero-line" style={{ "--d": `${0.08 + i * 0.12}s` } as React.CSSProperties}>
                  <span className="hero-line-in">
                    <Rich text={line} manualScript />
                  </span>
                </span>
              </Fragment>
            ))}
          </h1>
          <p className="lead hero-text" data-hero-in="" style={{ "--i": 1 } as React.CSSProperties}>
            <Rich text={hero.text} />
          </p>
          <div className="hero-actions" data-hero-in="" style={{ "--i": 2 } as React.CSSProperties}>
            <Cta href="#termin">{cta.main}</Cta>
            <Cta href="#fahrplan" variant="ghost">
              {hero.secondary}
            </Cta>
          </div>
          <div className="hero-gift" data-hero-in="" style={{ "--i": 3 } as React.CSSProperties}>
            <span className="hero-gift-doc" aria-hidden="true">
              <span className="hero-gift-paper">
                <i />
                <i />
                <i />
              </span>
              <span className="hero-gift-stamp">{geschenk.stamp}</span>
            </span>
            <p className="hero-sub">
              <Rich text={hero.sub} />
            </p>
          </div>
          <ul className="hero-proof" data-hero-in="" style={{ "--i": 4 } as React.CSSProperties}>
            {hero.proof.map((p, i) => (
              <li key={p.big}>
                {i === 2 ? (
                  <span className="proof-check" aria-hidden="true">
                    <Check size={13} />
                  </span>
                ) : null}
                <strong>
                  <Rich text={p.big} />
                </strong>
                <span className="proof-small">{p.small}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual" data-hero-in="" style={{ "--i": 5 } as React.CSSProperties}>
          <HeroMachine />
        </div>
      </div>
    </section>
  );
}
