import Image from "next/image";
import Link from "next/link";
import { footer } from "@/app/copy";
import { company } from "@/app/content";
import ConsentWiderruf from "./ConsentWiderruf";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-veil" aria-hidden="true" />
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src="/logo/svh-wort-96.webp" alt={company.name} width={215} height={28} />
            <p className="footer-claim">{footer.claim}</p>
          </div>
          <div>
            <p className="footer-title">{footer.contactTitle}</p>
            <ul className="footer-list">
              <li>
                <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
              </li>
              <li>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
              <li>
                <span>
                  {company.street}, {company.zipCity}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer-title">{footer.linksTitle}</p>
            <ul className="footer-list">
              {footer.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              <li>
                <ConsentWiderruf label={footer.consent} />
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-mark" role="img" aria-label={footer.watermark}>
          <div className="footer-mark-img" data-wordmark="" />
        </div>

        <div className="footer-legal">
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
