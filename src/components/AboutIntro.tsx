import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";
import { useTriggeredTypewriter } from "../hooks/useTriggeredTypewriter";
import { aboutMotion } from "../motion/motionConfig";
import { readScrollProgress } from "../motion/scrollProgress";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function stageT(p: number, start: number, end: number) {
  if (p <= start) return 0;
  if (p >= end) return 1;
  return easeInOutCubic((p - start) / (end - start));
}

/**
 * Title + big image peek then settle.
 * Desktop / iPad: flanking copy. Phone: stacked copy after images.
 */
export function AboutIntro() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLElement | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const [leftOn, setLeftOn] = useState(false);
  const [rightOn, setRightOn] = useState(false);
  const [trackVh, setTrackVh] = useState<number>(aboutMotion.trackVh);
  const leftLatched = useRef(false);
  const rightLatched = useRef(false);

  const leftType = useTriggeredTypewriter(profile.aboutLeft, leftOn, {
    speed: aboutMotion.typeSpeed,
  });
  const rightType = useTriggeredTypewriter(profile.aboutRight, rightOn, {
    speed: aboutMotion.typeSpeed,
  });

  useEffect(() => {
    const mq = window.matchMedia(
      `(max-width: ${aboutMotion.mobileMaxWidth}px)`
    );
    const syncTrack = () => {
      setTrackVh(
        mq.matches ? aboutMotion.trackVhMobile : aboutMotion.trackVh
      );
    };
    syncTrack();
    mq.addEventListener("change", syncTrack);
    return () => mq.removeEventListener("change", syncTrack);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let running = true;

    const isPhoneWidth = (vw: number) => vw <= aboutMotion.mobileMaxWidth;

    const layout = (p: number) => {
      const pin = pinRef.current;
      if (!pin) return;
      const vh = pin.clientHeight;
      const vw = pin.clientWidth;
      const isPhone = isPhoneWidth(vw);
      const stages = isPhone
        ? aboutMotion.stagesMobile
        : aboutMotion.stages;
      const ranges = [stages.bigIn, stages.midIn, stages.smallIn];

      const specs = aboutMotion.images.map((spec) =>
        isPhone && "mobile" in spec && spec.mobile
          ? { ...spec, ...spec.mobile }
          : spec
      );

      const bigSpec = specs[0];
      const bigT = reduced ? 1 : stageT(p, ranges[0].start, ranges[0].end);
      const bigScale = bigSpec.fromScale + (1 - bigSpec.fromScale) * bigT;
      const bigFullW = (bigSpec.width / 100) * vw;
      const bigW = bigFullW * bigScale;
      const bigH = bigW / bigSpec.aspect;
      const bigRestCy = (bigSpec.top / 100) * vh;
      const bigStartCy = (bigSpec.fromTop / 100) * vh;
      const bigCy = bigStartCy + (bigRestCy - bigStartCy) * bigT;
      const bigCx = (bigSpec.left / 100) * vw;
      const bigLeft = bigCx - bigW / 2;
      const bigTop = bigCy - bigH / 2;
      const bigRight = bigCx + bigW / 2;
      const bigBottom = bigCy + bigH / 2;

      const settledBigW = (bigSpec.width / 100) * vw;
      const settledBigH = settledBigW / bigSpec.aspect;
      const settledBigCy = (bigSpec.top / 100) * vh;
      const settledBigTop = settledBigCy - settledBigH / 2;
      const settledBigBottom = settledBigCy + settledBigH / 2;

      specs.forEach((layoutSpec, i) => {
        const el = imageRefs.current[i];
        const t = reduced ? 1 : stageT(p, ranges[i].start, ranges[i].end);
        const scale = layoutSpec.fromScale + (1 - layoutSpec.fromScale) * t;
        const fullW = (layoutSpec.width / 100) * vw;
        const w = fullW * scale;
        const h = w / layoutSpec.aspect;
        const settledH = fullW / layoutSpec.aspect;

        let restCx = (layoutSpec.left / 100) * vw;
        let restCy = (layoutSpec.top / 100) * vh;

        if (i === 1) {
          if (isPhone) {
            restCx = bigRight;
            restCy = bigTop + bigH * (2 / 3);
          } else {
            restCx = bigRight + fullW * 0.12;
            restCy = bigTop + bigH * 0.25;
          }
        } else if (i === 2 && isPhone) {
          restCx = bigLeft + fullW * 0.45;
          restCy = bigBottom - settledH * 0.45;
        }

        const startCy = (layoutSpec.fromTop / 100) * vh;
        const cy = startCy + (restCy - startCy) * t;
        const top = cy - h / 2;
        const left = restCx - w / 2;

        const show =
          layoutSpec.visibleFromStart || t > 0.001 || reduced ? 1 : 0;

        if (el) {
          el.style.width = `${w}px`;
          el.style.height = `${h}px`;
          el.style.opacity = String(show);
          el.style.zIndex = String(i + 1);
          el.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        }
      });

      const copy = copyRef.current;
      if (copy) {
        if (isPhone) {
          const midSpec = specs[1];
          const smallSpec = specs[2];
          const midH = ((midSpec.width / 100) * vw) / midSpec.aspect;
          const midBottom =
            settledBigTop + settledBigH * (2 / 3) + midH / 2;
          const smallH = ((smallSpec.width / 100) * vw) / smallSpec.aspect;
          const smallBottom =
            settledBigBottom - smallH * 0.45 + smallH / 2;
          const collageBottom = Math.max(
            settledBigBottom,
            midBottom,
            smallBottom
          );
          const gap = Math.max(36, vh * 0.055);
          copy.style.top = `${collageBottom + gap}px`;
          const copyReveal = reduced
            ? 1
            : stageT(p, stages.smallIn.end, stages.leftType);
          copy.style.opacity = String(copyReveal);
        } else {
          copy.style.top = "";
          copy.style.opacity = "";
        }
      }
    };

    const syncTriggers = (p: number) => {
      const isPhone = isPhoneWidth(window.innerWidth);
      const stages = isPhone
        ? aboutMotion.stagesMobile
        : aboutMotion.stages;

      if (reduced) {
        if (!leftLatched.current) {
          leftLatched.current = true;
          setLeftOn(true);
        }
        if (!rightLatched.current) {
          rightLatched.current = true;
          setRightOn(true);
        }
        return;
      }

      if (p < 0.05) {
        leftLatched.current = false;
        rightLatched.current = false;
        setLeftOn(false);
        setRightOn(false);
      } else {
        if (p >= stages.leftType && !leftLatched.current) {
          leftLatched.current = true;
          setLeftOn(true);
        }
        if (p >= stages.rightType && !rightLatched.current) {
          rightLatched.current = true;
          setRightOn(true);
        }
      }
    };

    const tick = () => {
      if (!running) return;
      const p = clamp(readScrollProgress(trackRef.current), 0, 1);
      layout(p);
      syncTriggers(p);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      id="about"
      ref={trackRef}
      className="relative z-[3] scroll-mt-16 bg-transparent [overflow-anchor:none] lg:scroll-mt-20"
      style={{ height: `${trackVh}vh` }}
    >
      <section
        ref={pinRef}
        className="sticky top-0 isolate h-[100svh] overflow-hidden bg-transparent"
      >
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          {aboutMotion.images.map((spec, i) => (
            <div
              key={spec.src}
              ref={(node) => {
                imageRefs.current[i] = node;
              }}
              data-about-image={i === 0 ? "first" : undefined}
              className="absolute left-0 top-0 overflow-hidden will-change-transform"
              style={{
                background: spec.tone,
                opacity: spec.visibleFromStart ? 1 : 0,
              }}
            >
              <img
                src={spec.src}
                alt=""
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 flex h-full flex-col px-5 pb-[max(4.5rem,env(safe-area-inset-bottom))] pt-16 mix-blend-difference sm:px-8 sm:pb-20 sm:pt-[4.5rem] lg:px-10 lg:pb-24 lg:pt-20">
          <h2 className="relative z-20 max-w-[12ch] font-[family-name:var(--font-display)] text-[clamp(1.85rem,8.5vw,4.125rem)] font-bold leading-[1.1] tracking-[-0.035em] text-white md:max-w-[24ch] md:text-[clamp(2.2rem,5.1vw,4.125rem)] lg:max-w-[28ch]">
            {profile.aboutHeadline}
          </h2>

          {/* Desktop + iPad copy */}
          <div className="relative z-20 mt-auto hidden flex-1 grid-cols-[minmax(0,1fr)_minmax(14rem,0.9fr)_minmax(0,1fr)] items-center gap-8 md:mt-0 md:grid lg:gap-10">
            <p
              className="max-w-[30ch] justify-self-start pt-[8vh] text-[clamp(0.95rem,1.15vw,1.1rem)] font-bold leading-[1.65] tracking-[-0.01em] text-white"
              aria-live="polite"
            >
              {leftType.displayed}
              {leftOn && !leftType.done && (
                <span
                  className="ml-[2px] inline-block h-[1em] w-[2px] align-middle bg-white"
                  style={{ animation: "blink 1s step-end infinite" }}
                />
              )}
            </p>
            <div aria-hidden />
            <p
              className="max-w-[30ch] justify-self-end pt-[8vh] text-[clamp(0.95rem,1.15vw,1.1rem)] font-bold leading-[1.65] tracking-[-0.01em] text-white"
              aria-live="polite"
            >
              {rightType.displayed}
              {rightOn && !rightType.done && (
                <span
                  className="ml-[2px] inline-block h-[1em] w-[2px] align-middle bg-white"
                  style={{ animation: "blink 1s step-end infinite" }}
                />
              )}
            </p>
          </div>
        </div>

        {/* Phone copy — stacked, below collage, after images */}
        <div
          ref={copyRef}
          className="pointer-events-none absolute inset-x-5 z-20 flex flex-col gap-4 mix-blend-difference opacity-0 sm:inset-x-8 md:hidden"
        >
          <p
            className="w-full text-[0.95rem] font-bold leading-[1.55] tracking-[-0.01em] text-white text-justify sm:text-[1.05rem]"
            aria-live="polite"
          >
            {leftType.displayed}
            {leftOn && !leftType.done && (
              <span
                className="ml-[2px] inline-block h-[1em] w-[2px] align-middle bg-white"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            )}
          </p>
          <p
            className="w-full text-[0.95rem] font-bold leading-[1.55] tracking-[-0.01em] text-white text-justify sm:text-[1.05rem]"
            aria-live="polite"
          >
            {rightType.displayed}
            {rightOn && !rightType.done && (
              <span
                className="ml-[2px] inline-block h-[1em] w-[2px] align-middle bg-white"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
