"use client";

import { useRef, useState } from "react";
import { hero } from "@/app/copy";
import { Play } from "@/components/system/Icons";
import HeroMachine from "../HeroMachine";

/* ====================================================================
   Erklärvideo (VSL) im Start: festes 16:9-Fenster, großer Abspielknopf.
   - hero.vsl.src leer: gestalteter Platzhalter. Im Fenster läuft die
     Aufgaben-Maschine als Vorschau, der Knopf ist nur Bild, darunter
     „Video folgt“. Ein Klick tut nichts.
   - hero.vsl.src gesetzt: selbst gehostetes <video> mit preload="none".
     Vor dem Klick lädt nur das (eigene) Standbild, kein Videobyte und
     nichts von Dritten. Der Klick startet die Wiedergabe direkt im
     Klick-Ereignis (so erlaubt es auch Safari auf dem iPhone).
     Ohne Standbild bleibt die Maschine bis zum Klick die Vorschau.
   Einzutragen sind nur src und poster in app/copy.ts.
   ==================================================================== */

export default function Vsl({ className = "", style }: Readonly<{ className?: string; style?: React.CSSProperties }>) {
  const { src, poster, title, play, placeholder } = hero.vsl;
  const ready = src.length > 0;
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Vorschau: eigenes Standbild (steckt im <video>) oder die Maschine
  const preview = ready && poster ? "poster" : "machine";

  const start = () => {
    const v = video.current;
    if (!v) return;
    setPlaying(true);
    v.controls = true;
    v.play().catch(() => {
      /* Wiedergabe verweigert: Steuerelemente sind da, ein zweiter Tipp startet sie */
    });
    v.focus({ preventScroll: true });
  };

  return (
    <figure className={`vsl ${className}`} style={style} aria-label={title} data-hero-in="" data-state={ready ? (playing ? "playing" : "ready") : "soon"}>
      <div className="vsl-frame">
        <div className="vsl-screen">
          {ready ? (
            <video
              ref={video}
              className="vsl-video"
              src={src}
              poster={poster || undefined}
              preload="none"
              playsInline
              tabIndex={playing ? 0 : -1}
              aria-hidden={playing ? undefined : true}
              aria-label={title}
            />
          ) : null}

          {playing ? null : (
            <>
              {preview === "machine" ? <HeroMachine /> : null}
              <div className="vsl-scrim" aria-hidden="true" />
              {/* Titelzeile; vorgelesen wird der Titel über das aria-label der figure */}
              <p className="vsl-title" aria-hidden="true">
                {title}
              </p>
              {ready ? (
                <button type="button" className="vsl-hit" data-preview={preview} onClick={start} aria-label={`${play}: ${title}`}>
                  <span className="vsl-play">
                    <Play size={28} />
                  </span>
                </button>
              ) : (
                <div className="vsl-hit" data-preview={preview} data-soon="">
                  <span className="vsl-play" aria-hidden="true">
                    <Play size={28} />
                  </span>
                  <span className="vsl-soon">{placeholder}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </figure>
  );
}
