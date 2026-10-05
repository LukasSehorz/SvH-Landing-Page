import type { ReactNode } from "react";

/* Ein MacBook-Pro-artiger Laptop aus reinem CSS (Rahmen, Kamera-Aussparung, Aluminium-Unterteil).
   Der Bildschirm zeigt beliebigen Inhalt (children) und skaliert mit der Breite. */
export default function Laptop({ children, label, className = "" }: { children: ReactNode; label?: string; className?: string }) {
  return (
    <figure className={`lp ${className}`} aria-label={label}>
      <div className="lp-deckel">
        <span className="lp-kamera" aria-hidden="true" />
        <div className="lp-bildschirm">{children}</div>
      </div>
      <div className="lp-unterteil" aria-hidden="true">
        <span className="lp-griff" />
      </div>
    </figure>
  );
}
