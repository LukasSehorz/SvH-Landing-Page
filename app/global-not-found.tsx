import type { Metadata } from "next";
import LayoutA, { viewport } from "./(a)/layout";
import NotFound, { metadata as notFoundMeta } from "./(a)/not-found";

/* Unbekannte Adressen: zwei Root-Layouts (A und B) → Next braucht eine globale 404.
   Zeigt die 404 von Variante A samt Leiste und Fußzeile, wie vorher. */

export { viewport };
export const metadata: Metadata = notFoundMeta;

export default function GlobalNotFound() {
  return (
    <LayoutA>
      <NotFound />
    </LayoutA>
  );
}
