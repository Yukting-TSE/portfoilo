import { Link } from "react-router-dom";
import { profile } from "../data/profile";

type Props = {
  onOpenContact: () => void;
};

const footerLinks = [
  { label: "About", to: "/about" },
  { label: "Works", hash: "works" },
  { label: "Contact", hash: "contact" },
];

export function Footer({ onOpenContact }: Props) {
  const yearShort = String(new Date().getFullYear()).slice(-2);
  const yearFull = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative z-[1] flex h-[100svh] min-h-[100svh] flex-col justify-between overflow-hidden bg-black px-[clamp(1.25rem,2.2vw,2rem)] text-white"
      style={{
        paddingTop:
          "max(clamp(1.25rem,2.2vw,2rem), env(safe-area-inset-top, 0px))",
        paddingBottom:
          "max(clamp(0.85rem,1.6vw,1.35rem), env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 65% 50% at 82% 40%, rgba(70,70,74,0.4) 0%, transparent 58%),
            radial-gradient(ellipse 48% 38% at 12% 82%, rgba(48,48,52,0.35) 0%, transparent 55%),
            linear-gradient(165deg, #0a0a0a 0%, #000 50%, #080808 100%)
          `,
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-[clamp(1.25rem,2.2vw,2rem)] top-0 h-px bg-white"
        aria-hidden
      />

      <div className="relative z-[1] flex w-full items-start justify-between gap-6 pt-1">
        <h2 className="max-w-[14ch] font-[family-name:var(--font-display)] text-[clamp(2.75rem,7.3vw,8.7rem)] font-bold leading-[0.9] tracking-[-0.045em] text-white">
          Let&apos;s make
          <br />
          something
          <br />
          interesting.
        </h2>
        <p
          className="shrink-0 select-none self-start font-[family-name:var(--font-display)] text-[clamp(4rem,16.4vw,19.5rem)] font-bold leading-none tracking-[-0.06em] text-white"
          aria-label={`Copyright 20${yearShort}`}
        >
          ©{yearShort}
        </p>
      </div>

      <div className="relative z-[1] flex w-full flex-col gap-[clamp(1.5rem,2.8vw,2.65rem)]">
        <p className="font-[family-name:var(--font-display)] text-[clamp(1.15rem,2.25vw,2.7rem)] font-bold leading-[1.15] tracking-[-0.03em] text-white">
          {profile.roles.join(" · ")}
        </p>

        <button
          type="button"
          onClick={onOpenContact}
          className="footer-cta pressable flex w-full items-center justify-between gap-4 bg-white px-[clamp(1.25rem,2.2vw,2rem)] py-[clamp(0.85rem,1.5vw,1.35rem)] text-left text-black"
        >
          <span className="font-[family-name:var(--font-display)] text-[clamp(1.15rem,2.25vw,2.7rem)] font-bold tracking-[-0.03em]">
            Get in touch
          </span>
          <span
            className="footer-cta-arrow font-[family-name:var(--font-display)] text-[clamp(1.15rem,2.25vw,2.7rem)] leading-none transition-transform duration-[200ms] [transition-timing-function:var(--ease-out)]"
            aria-hidden
          >
            →
          </span>
        </button>

        <div className="flex flex-col gap-5 font-[family-name:var(--font-display)] text-[clamp(0.7rem,0.95vw,1.05rem)] font-bold tracking-[-0.01em] text-white lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3 sm:gap-x-8">
            <span className="select-none text-[1.05em] leading-none" aria-hidden>
              ++
            </span>
            <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  to={
                    "to" in link && link.to
                      ? link.to
                      : { pathname: "/", hash: `#${link.hash}` }
                  }
                  className="footer-link transition-opacity duration-[200ms]"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`mailto:${profile.email}`}
                className="footer-link transition-opacity duration-[200ms]"
              >
                {profile.email}
              </a>
            </nav>
          </div>

          <address className="not-italic leading-[1.5]">
            {profile.englishName}
            <br />
            {profile.name}
            <br />
            {profile.location}
          </address>

          <div className="leading-[1.5] lg:text-right">
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="footer-link block transition-opacity duration-[200ms]"
            >
              {profile.phone}
            </a>
            <p className="mt-0">All rights reserved ©{yearFull}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
