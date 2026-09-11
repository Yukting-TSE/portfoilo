import { useEffect, useRef } from "react";
import { HeroFieldEngine } from "../lib/heroField";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Smoothstep — continuous first derivative at ends */
function smoothstep(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

/** Ease that rises quickly early — for fade-ahead opacity */
function softstepEarly(t: number) {
  const x = clamp(t, 0, 1);
  return smoothstep(Math.pow(x, 0.72));
}

/**
 * Fixed generative field over the homepage.
 * One continuous corridor from mid-Hero through early About;
 * spatial targets move gently, time lerp finishes the dissolve.
 */
export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ready = false;
    const engine = new HeroFieldEngine(canvas, () => {
      ready = true;
      updateScrollBlend();
    });
    engine.start();

    const ro = new ResizeObserver(() => engine.scheduleResize());
    ro.observe(document.documentElement);

    const updateScrollBlend = () => {
      const hero = document.getElementById("top");
      const about = document.getElementById("about");
      const vh = window.innerHeight || 1;

      if (!hero) {
        engine.setScrollBlend(1, 1, 1);
        engine.setVisible(true);
        canvas.style.visibility = "visible";
        canvas.style.opacity = ready ? "1" : "0";
        return;
      }

      const heroTop = hero.getBoundingClientRect().top;
      const aboutTop = about?.getBoundingClientRect().top ?? vh * 2;
      const headline = about?.querySelector("h2");
      const headlineTop = headline
        ? headline.getBoundingClientRect().top
        : aboutTop + vh * 0.2;

      // Corridor starts on first scroll — opacity leads so dots fade early
      const tHero = clamp((-heroTop) / (vh * 1.45), 0, 1);
      const tAbout = clamp((vh * 0.98 - aboutTop) / (vh * 1.1), 0, 1);
      const tHead = clamp((vh * 0.88 - headlineTop) / (vh * 0.9), 0, 1);
      const t = smoothstep(Math.max(tHero, tAbout * 0.75, tHead * 0.45));

      const rayAmount = 1 - smoothstep(clamp(t / 0.22, 0, 1));
      const sizeScale = 1 - smoothstep(t * 0.88);
      // Lower exponent → opacity drops sooner in the corridor
      const opacity = 1 - softstepEarly(t);

      engine.setScrollBlend(sizeScale, opacity, rayAmount);
      engine.setVisible(true);
      canvas.style.visibility = "visible";
      canvas.style.opacity = ready ? "1" : "0";
    };

    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        updateScrollBlend();
      });
    };

    updateScrollBlend();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const onPointer = (e: PointerEvent) => {
      engine.setPointer(
        e.clientX,
        e.clientY,
        e.clientX >= 0 &&
          e.clientY >= 0 &&
          e.clientX <= window.innerWidth &&
          e.clientY <= window.innerHeight,
      );
    };

    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(scrollRaf);
      ro.disconnect();
      engine.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[2] border-0 outline-none"
      style={{
        border: "none",
        outline: "none",
        boxShadow: "none",
        width: "100%",
        height: "100%",
        opacity: 0,
        visibility: "hidden",
      }}
      aria-hidden
    />
  );
}
