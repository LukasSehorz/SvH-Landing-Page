"use client";

import { useEffect, useState } from "react";
import { cta } from "@/app/copy";
import Cta from "./Cta";

/** Feste CTA-Leiste unten (mobil), ab dem zweiten Bildschirm; weicht dem Formular aus. */
export default function MobileCta() {
  const [past, setPast] = useState(false);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const target = document.getElementById("termin");
    const footer = document.querySelector("footer");
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target, e.isIntersecting));
        setFormInView(Array.from(seen.values()).some(Boolean));
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    if (target) io.observe(target);
    if (footer) io.observe(footer);
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const show = past && !formInView;
  return (
    <div className="mcta" data-show={show ? "true" : "false"} aria-hidden={show ? undefined : true} inert={!show}>
      <Cta href="#termin">{cta.main}</Cta>
    </div>
  );
}
