"use client";

import { useEffect, useRef } from "react";

/** Wortmarke CONSULTING am Fuß: Bildmaske erst laden, wenn die Fußzeile nah ist. */
export default function FooterMark() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.setAttribute("data-mask", "");
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className="footer-mark-img" data-wordmark="" />;
}
