import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { profile } from "../data/profile";
import { useTypewriter } from "../hooks/useTypewriter";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function Hero() {
  const { displayed, done } = useTypewriter(profile.typewriter, {
    speed: 20,
    startDelay: 80,
  });
  const [ready, setReady] = useState(false);
  const [washOpacity, setWashOpacity] = useState(1);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("top");
      if (!hero) return;
      const vh = window.innerHeight || 1;
      const bottom = hero.getBoundingClientRect().bottom;
      // Fade wash as soon as Hero starts leaving — no residual band at the seam
      const leave = clamp((vh * 1.05 - bottom) / (vh * 0.75), 0, 1);
      setWashOpacity(1 - leave);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      /* ignore */
    }
  };

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden border-0 bg-transparent px-5 pb-12 outline-none text-[var(--white)] sm:px-8 md:justify-center md:px-10 md:pb-0"
    >
      {/* Desktop-only left veil — redundant on narrow screens */}
      <div
        className="pointer-events-none absolute inset-0 z-[9] hidden md:block"
        style={{
          opacity: washOpacity,
          background:
            "linear-gradient(90deg, #050505 0%, rgba(5,5,5,0.78) 16%, rgba(5,5,5,0.4) 36%, rgba(5,5,5,0.1) 55%, transparent 72%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 58%, rgba(0,0,0,0.45) 78%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 58%, rgba(0,0,0,0.45) 78%, transparent 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-xl">
        <p
          className={`mb-5 min-h-[72px] text-[clamp(18px,4vw,26px)] font-normal leading-[1.35] text-white transition-opacity duration-500 sm:mb-6 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          style={{
            textShadow: "0 1px 2px rgba(0,0,0,0.55), 0 2px 14px rgba(0,0,0,0.35)",
          }}
          aria-live="polite"
        >
          {displayed}
          {!done && (
            <span
              className="ml-[2px] inline-block h-[1.1em] w-[2px] align-middle bg-white"
              style={{ animation: "blink 1s step-end infinite" }}
            />
          )}
        </p>

        <div
          className={`mb-8 flex flex-wrap transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          {profile.pills.map((pill) => {
            const className =
              "mb-[0.4em] mr-[0.2em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-white/25 bg-white/55 px-4 py-[0.35em] text-[13px] text-[var(--black)] backdrop-blur-md transition-colors duration-200 hover:bg-white/80 sm:px-5 sm:text-[15px]";
            const isExternal =
              pill.href.startsWith("http") ||
              pill.href.toLowerCase().endsWith(".pdf");
            const isRoute = pill.href.startsWith("/") && !isExternal;

            if (isRoute) {
              return (
                <Link key={pill.label} to={pill.href} className={className}>
                  {pill.label}
                </Link>
              );
            }

            return (
              <a
                key={pill.label}
                href={pill.href}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={className}
              >
                {pill.label}
              </a>
            );
          })}
          <button
            type="button"
            onClick={copyEmail}
            className="mb-[0.4em] mr-[0.2em] inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/40 bg-white/20 px-4 py-[0.35em] text-[13px] text-[var(--black)] backdrop-blur-md transition-colors duration-200 hover:bg-white/70 sm:gap-3 sm:px-5 sm:text-[15px]"
          >
            <span>
              Reach me: <u className="underline-offset-1">{profile.email}</u>
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect
                x="9"
                y="9"
                width="13"
                height="13"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M5 15V5a2 2 0 0 1 2-2h10"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        <div
          className={`flex flex-wrap gap-x-4 gap-y-1 text-[12px] tracking-[0.02em] text-white/85 transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          style={{
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          {profile.metadata.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>

      <a
        href="#works"
        className={`absolute bottom-6 right-6 z-10 hidden flex-col items-center gap-1 text-[11px] tracking-[0.18em] text-white/70 transition-opacity duration-500 md:flex ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        SCROLL
        <span
          className="scroll-arrow"
          style={{ animation: "scrollPulse 2s ease-in-out infinite" }}
        >
          ↓
        </span>
      </a>
    </section>
  );
}
