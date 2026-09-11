import { Link, useLocation, useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";

type Props = {
  menuOpen: boolean;
  onToggleMenu: () => void;
  /** 0–1; fades out when entering the contact footer */
  opacity?: number;
};

const links = [
  { label: "人机交互", hash: "cat-hci" },
  { label: "媒体艺术", hash: "cat-media" },
  { label: "商业合作", hash: "cat-commercial" },
  { label: "About ME", to: "/about" },
];

export function Navigation({
  menuOpen,
  onToggleMenu,
  opacity = 1,
}: Props) {
  const faded = opacity < 0.04;
  const location = useLocation();
  const navigate = useNavigate();

  const goHomeTop = (e: MouseEvent) => {
    if (location.pathname !== "/") return;
    e.preventDefault();
    if (location.hash) {
      navigate("/", { replace: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between bg-transparent px-6 py-5 text-[var(--fg)] sm:px-8"
      style={{
        opacity,
        pointerEvents: faded ? "none" : "auto",
        transition: "opacity 60ms linear",
      }}
      aria-hidden={faded}
    >
      <Link
        to="/"
        onClick={goHomeTop}
        className="relative z-[110] font-[family-name:var(--font-display)] text-[21px] tracking-tight transition-opacity duration-300 hover:opacity-45 sm:text-[26px]"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75), 0 0 12px rgba(0,0,0,0.35)" }}
        tabIndex={faded ? -1 : undefined}
      >
        Yukting®{" "}
        <span className="select-none tracking-[-0.02em]" aria-hidden>
          ✳︎
        </span>
      </Link>

      <nav
        className="hidden items-center gap-7 md:flex lg:gap-9"
        aria-label="Primary"
      >
        {links.map((l) => {
          const className =
            "group relative text-[13px] tracking-[0.04em] transition-all duration-300 hover:-translate-y-0.5 lg:text-[14px] [text-shadow:0_1px_3px_rgba(0,0,0,0.75),0_0_10px_rgba(0,0,0,0.35)]";
          const label = (
            <>
              <span className="transition-opacity duration-300 group-hover:opacity-45">
                {l.label}
              </span>
              <span
                className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-[var(--fg)] transition-all duration-300 group-hover:w-full"
                aria-hidden
              />
            </>
          );

          if ("to" in l && l.to) {
            return (
              <Link
                key={l.label}
                to={l.to}
                tabIndex={faded ? -1 : undefined}
                className={className}
              >
                {label}
              </Link>
            );
          }

          return (
            <Link
              key={l.hash}
              to={{ pathname: "/", hash: `#${l.hash}` }}
              tabIndex={faded ? -1 : undefined}
              className={className}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="relative z-[110] inline-flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={onToggleMenu}
        tabIndex={faded ? -1 : undefined}
      >
        <span
          className={`block h-[2px] w-6 bg-current transition duration-300 ${
            menuOpen ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-6 bg-current transition duration-300 ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-6 bg-current transition duration-300 ${
            menuOpen ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>
    </header>
  );
}
