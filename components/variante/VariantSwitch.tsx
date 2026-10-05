import Link from "next/link";
import styles from "./VariantSwitch.module.css";

/* Umschalter zwischen Variante A (/) und Variante B (/b). Liegt in beiden Layouts, bringt eigenes CSS mit. */

const varianten = [
  { key: "a", label: "A", href: "/" },
  { key: "b", label: "B", href: "/b" },
] as const;

export default function VariantSwitch({ aktiv }: { aktiv: "a" | "b" }) {
  return (
    <nav className={styles.switch} aria-label="Variante wählen">
      {varianten.map((v) =>
        v.key === aktiv ? (
          <span key={v.key} className={`${styles.opt} ${styles.aktiv}`} aria-current="page">
            {v.label}
          </span>
        ) : (
          <Link key={v.key} href={v.href} className={styles.opt} prefetch={false}>
            {v.label}
          </Link>
        ),
      )}
    </nav>
  );
}
