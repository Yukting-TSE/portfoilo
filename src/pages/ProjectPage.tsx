import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from "react";
import { Link, useParams } from "react-router-dom";
import { ContactOverlay } from "../components/ContactOverlay";
import { Footer } from "../components/Footer";
import { LightboxProvider, LightboxTrigger } from "../components/ImageLightbox";
import { LoadingMark, SmartImage, useMediaDimensions, useVideoDimensions } from "../components/MediaLoad";
import { MobileMenu } from "../components/MobileMenu";
import { Navigation } from "../components/Navigation";
import { caseDetailFor, findProject } from "../data/projects";
import type {
  DetailFigure,
  DetailPrototype,
  DetailSection,
  DetailTable,
  ProjectDetail,
} from "../data/projectDetail";
import { useInView } from "../hooks/useInView";

export function ProjectPage() {
  const { id = "" } = useParams();
  const found = findProject(id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [navOpacity, setNavOpacity] = useState(1);

  // Lock to top before paint so opening a case never inherits prior scroll
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || contactOpen ? "hidden" : "";
  }, [menuOpen, contactOpen]);

  useEffect(() => {
    const update = () => {
      const contact = document.getElementById("contact");
      if (!contact) {
        setNavOpacity(1);
        return;
      }
      const { top } = contact.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const next = Math.min(1, Math.max(0, top / vh));
      setNavOpacity(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [found]);

  if (!found) {
    return (
      <main className="flex min-h-[100svh] flex-col items-center justify-center bg-black px-6 text-white">
        <p className="mb-6 text-white/70">Project not found.</p>
        <Link to="/" className="underline underline-offset-4 hover:opacity-60">
          ← Back home
        </Link>
      </main>
    );
  }

  const { project } = found;

  return (
    <LightboxProvider>
      <Navigation
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        opacity={navOpacity}
      />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ContactOverlay
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />

      <main className="min-h-[100svh] bg-black pt-20 text-[var(--fg)] sm:pt-24">
        <CaseStudy title={project.title} detail={caseDetailFor(project)} />
      </main>

      <Footer onOpenContact={() => setContactOpen(true)} />
    </LightboxProvider>
  );
}

export function CaseStudy({
  title,
  detail,
}: {
  title: string;
  detail: ProjectDetail;
}) {
  const headline = detail.headline ?? title;
  const meta = detail.meta ?? [];
  const services = detail.services
    ? Array.isArray(detail.services)
      ? detail.services
      : [detail.services]
    : [];
  const bodySections = detail.sections.filter((s) => s.type !== "meta");
  const hasLead = detail.lead.length > 0;
  const showRightMeta = services.length > 0 && !hasLead;

  const metaRowClass =
    "grid grid-cols-[7.5rem_minmax(0,1fr)] items-baseline gap-3 border-t border-white/25 py-3 text-[0.88rem] font-bold text-white last:border-b sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:text-[0.95rem]";

  return (
    <article className="pb-28">
      <div className="px-5 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pt-16">
        <div className="grid gap-x-12 gap-y-0 lg:grid-cols-2 lg:items-stretch xl:gap-x-20">
          <div>
            <p className="mb-4 text-[0.85rem] font-bold tracking-[0.02em] text-white sm:mb-5 sm:text-[0.9rem]">
              {detail.eyebrow ?? "Case Study"}
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.15rem,4.4vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.045em] text-white">
              {headline}
            </h1>
          </div>

          <div className="hidden lg:block" aria-hidden />

          {meta.length > 0 && (
            <dl className="mt-10 w-full max-w-xl sm:mt-12">
              {meta.map((item) => (
                <div key={item.label} className={metaRowClass}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {showRightMeta ? (
            <dl className="mt-10 w-full max-w-xl sm:mt-12">
              {services.map((item) => (
                <div key={item.label} className={metaRowClass}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div
              className={`flex w-full max-w-xl flex-col text-white ${
                meta.length > 0 ? "mt-10 sm:mt-12" : "mt-8"
              }`}
            >
              <div className="space-y-5 text-[0.95rem] font-bold leading-[1.7] tracking-[0.035em] sm:text-[1.05rem]">
                {detail.lead.map((p, i) => {
                  if (typeof p === "string") {
                    return <p key={p.slice(0, 24)}>{p}</p>;
                  }
                  if ("muted" in p && p.muted) return null;
                  if ("link" in p) {
                    return (
                      <p key={`lead-link-${i}`}>
                        {p.before}
                        <a
                          href={p.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 transition-opacity hover:opacity-60"
                        >
                          {p.link.label}
                        </a>
                        {p.after}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
              {detail.lead.some(
                (p) => typeof p !== "string" && "muted" in p && p.muted,
              ) && (
                <div className="mt-auto space-y-2 pt-8 text-[0.72rem] font-normal leading-[1.65] tracking-[0.02em] text-white/70 sm:text-[0.78rem]">
                  {detail.lead.map((p, i) => {
                    if (typeof p === "string" || !("muted" in p) || !p.muted) {
                      return null;
                    }
                    return <p key={`lead-muted-${i}`}>{p.text}</p>;
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {detail.cover && (
        <div className="mt-12 w-full px-5 sm:mt-14 sm:px-8 lg:mt-16 lg:px-12">
          <CoverMedia cover={detail.cover} />
        </div>
      )}

      <div className="mt-14 space-y-14 px-5 sm:mt-16 sm:px-8 lg:mt-20 lg:space-y-20 lg:px-12">
        {bodySections.map((section, i) => (
          <BodySection key={`${section.type}-${i}`} section={section} />
        ))}
      </div>

      {detail.closing && (
        <p className="mx-auto mt-20 max-w-3xl px-5 text-center font-[family-name:var(--font-display)] text-[clamp(1.15rem,2.5vw,1.55rem)] font-bold tracking-[-0.02em] text-white sm:px-8">
          {detail.closing}
        </p>
      )}
    </article>
  );
}

function CoverMedia({ cover }: { cover: DetailFigure }) {
  if (cover.video) {
    return <LocalCoverVideo cover={cover} />;
  }

  return (
    <LightboxTrigger src={cover.src} alt={cover.alt ?? ""}>
      <div className="overflow-hidden rounded-2xl">
        <img
          src={cover.src}
          alt={cover.alt ?? ""}
          className={
            cover.fit === "natural"
              ? "h-auto w-full"
              : "aspect-video h-auto w-full object-cover"
          }
        />
      </div>
    </LightboxTrigger>
  );
}

function formatVideoClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Local cover.mp4: poster until play; scrub + play/pause + optional mute. */
function LocalCoverVideo({ cover }: { cover: DetailFigure }) {
  const { ref, inView } = useInView<HTMLDivElement>({
    once: false,
    threshold: 0.1,
    rootMargin: "120px 0px 120px 0px",
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrubbingRef = useRef(false);
  const userPausedRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (inView) setShouldLoad(true);
  }, [inView]);

  useEffect(() => {
    setPlaying(false);
    setMuted(true);
    setDuration(0);
    setCurrent(0);
    userPausedRef.current = false;
  }, [cover.src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  }, [cover.src, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMeta = () => {
      if (Number.isFinite(video.duration)) setDuration(video.duration);
    };
    const onTime = () => {
      if (!scrubbingRef.current) setCurrent(video.currentTime);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("durationchange", onMeta);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("play", onPlay);
    video.addEventListener("playing", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("durationchange", onMeta);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("playing", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [cover.src, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    if (!inView) {
      video.pause();
      setPlaying(false);
      return;
    }

    video.muted = muted;
    video.defaultMuted = muted;

    if (userPausedRef.current) return;

    const tryPlay = () => {
      if (userPausedRef.current) return;
      void video.play().catch(() => {
        /* autoplay may be blocked; tap-to-play fallback handles it */
      });
    };

    tryPlay();
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("loadeddata", tryPlay);
    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
    };
  }, [inView, muted, cover.src, shouldLoad]);

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    userPausedRef.current = false;
    video.muted = muted;
    video.defaultMuted = muted;
    void video.play().catch(() => {});
  };

  const pauseVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    userPausedRef.current = true;
    video.pause();
  };

  const togglePlay = () => {
    if (playing) pauseVideo();
    else playVideo();
  };

  const seekTo = (ratio: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const next = Math.min(Math.max(ratio, 0), 1) * video.duration;
    try {
      video.currentTime = next;
    } catch {
      /* ignore seek errors while buffering */
    }
    setCurrent(next);
  };

  const fitClass =
    cover.fit === "natural"
      ? "h-auto w-full object-contain"
      : "absolute inset-0 z-0 h-full w-full object-cover";
  const isNatural = cover.fit === "natural";
  const showPoster = !playing;
  const progress = duration > 0 ? current / duration : 0;
  const posterSrc = cover.poster;

  return (
    <div
      ref={ref}
      className={
        isNatural
          ? "relative w-full overflow-hidden rounded-2xl bg-black"
          : "relative aspect-video w-full overflow-hidden rounded-2xl bg-black"
      }
    >
      <video
        ref={videoRef}
        src={shouldLoad ? cover.src : undefined}
        poster={posterSrc}
        className={fitClass}
        muted={muted}
        autoPlay
        loop
        playsInline
        preload={shouldLoad ? "auto" : "none"}
        controls={false}
        disablePictureInPicture
      />

      {showPoster && posterSrc && (
        <img
          src={posterSrc}
          alt={cover.alt ?? ""}
          className={
            isNatural
              ? "absolute inset-0 z-[1] h-full w-full object-contain"
              : "absolute inset-0 z-[1] h-full w-full object-cover"
          }
        />
      )}

      {showPoster && inView && (
        <button
          type="button"
          className="absolute inset-0 z-[2] flex items-center justify-center bg-black/20"
          aria-label="播放视频"
          onClick={playVideo}
        >
          <span className="rounded-full border border-white/30 bg-black/55 px-4 py-2 text-[0.75rem] font-bold tracking-[0.06em] text-white backdrop-blur-sm">
            播放
          </span>
        </button>
      )}

      {playing && (
        <button
          type="button"
          className="absolute inset-0 z-[2] cursor-pointer bg-transparent"
          aria-label="暂停视频"
          onClick={pauseVideo}
        />
      )}

      {inView && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-black/70 via-black/35 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4">
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="shrink-0 rounded-full border border-white/25 bg-black/55 px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.04em] text-white backdrop-blur-sm transition-opacity hover:bg-black/75"
              aria-label={playing ? "暂停" : "播放"}
            >
              {playing ? "暂停" : "播放"}
            </button>
            <span className="min-w-[2.4rem] text-[0.65rem] font-bold tabular-nums tracking-[0.02em] text-white/80">
              {formatVideoClock(current)}
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={Number.isFinite(progress) ? progress : 0}
              aria-label="视频进度"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/25 accent-white [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              onPointerDown={() => {
                scrubbingRef.current = true;
              }}
              onPointerUp={() => {
                scrubbingRef.current = false;
              }}
              onPointerCancel={() => {
                scrubbingRef.current = false;
              }}
              onChange={(e) => {
                seekTo(Number(e.target.value));
              }}
            />
            <span className="min-w-[2.4rem] text-right text-[0.65rem] font-bold tabular-nums tracking-[0.02em] text-white/80">
              {formatVideoClock(duration)}
            </span>
            {cover.soundToggle && (
              <button
                type="button"
                onClick={() => {
                  const video = videoRef.current;
                  const next = !muted;
                  setMuted(next);
                  if (video) {
                    video.muted = next;
                    video.defaultMuted = next;
                    if (!userPausedRef.current) {
                      void video.play().catch(() => {});
                    }
                  }
                }}
                className="shrink-0 rounded-full border border-white/25 bg-black/55 px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.04em] text-white backdrop-blur-sm transition-opacity hover:bg-black/75"
                aria-label={muted ? "Unmute video" : "Mute video"}
              >
                {muted ? "开启声音" : "静音"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BodySection({ section }: { section: DetailSection }) {
  if (section.type === "columns") {
    const isEnd = section.align === "end";
    const isBetween = section.align === "between";
    const pairCount = Math.max(section.left.length, section.right.length);
    const leftFirst = section.left[0];
    const rightFirst = section.right[0];
    const leftHasTitle =
      (leftFirst?.type === "prose" && Boolean(leftFirst.title)) ||
      (leftFirst?.type === "goals" && Boolean(leftFirst.heading));
    const rightIsMedia =
      rightFirst?.type === "figure" || rightFirst?.type === "table";
    const offsetTitle =
      section.offsetTitle === false
        ? false
        : Boolean(section.offsetTitle) || (leftHasTitle && rightIsMedia);
    const useSubgrid =
      !isEnd &&
      !isBetween &&
      !section.heading &&
      !offsetTitle &&
      section.left.length === section.right.length &&
      pairCount > 1;
    const titleOffset = offsetTitle ? (
      <div
        className="mb-4 hidden font-[family-name:var(--font-display)] text-[clamp(0.95rem,1.5vw,1.15rem)] font-bold tracking-[-0.02em] text-transparent select-none lg:block"
        aria-hidden
      >
        &nbsp;
      </div>
    ) : null;

    if (useSubgrid) {
      const rowAlignClass =
        section.rowAlign === "end" ? "lg:items-end" : "";
      return (
        <div
          className="grid gap-x-12 gap-y-5 lg:grid-cols-2 xl:gap-x-20"
          style={{ gridTemplateRows: `repeat(${pairCount}, auto)` }}
        >
          <div
            className={`grid w-full max-w-xl gap-y-5 lg:grid-rows-subgrid ${rowAlignClass}`}
            style={{ gridRow: `span ${pairCount}` }}
          >
            {section.left.map((child, i) => (
              <SectionBlock key={`L-${child.type}-${i}`} section={child} />
            ))}
          </div>
          <div
            className={`grid w-full max-w-xl gap-y-5 lg:grid-rows-subgrid ${rowAlignClass}`}
            style={{ gridRow: `span ${pairCount}` }}
          >
            {section.right.map((child, i) => (
              <SectionBlock key={`R-${child.type}-${i}`} section={child} />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        data-case-columns=""
        className={`grid gap-x-12 gap-y-10 lg:grid-cols-2 xl:gap-x-20 ${
          isEnd || isBetween ? "lg:items-stretch" : "lg:items-start"
        }`}
      >
        <div
          data-case-left=""
          className={
            isEnd
              ? "flex w-full max-w-xl flex-col gap-10"
              : "w-full max-w-xl space-y-10"
          }
        >
          {section.heading && (
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.65rem,3.2vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.045em] text-white">
              {section.heading}
            </h2>
          )}
          <div className={`space-y-10 ${isEnd ? "mt-auto" : ""}`}>
            {section.left.map((child, i) => (
              <SectionBlock key={`L-${child.type}-${i}`} section={child} />
            ))}
          </div>
        </div>
        <div
          className={
            isBetween
              ? "flex h-full flex-col"
              : "space-y-10"
          }
        >
          {titleOffset}
          <div
            className={
              isBetween
                ? "flex min-h-0 flex-1 flex-col justify-between gap-6 lg:gap-8"
                : undefined
            }
          >
            {section.right.map((child, i) => (
              <SectionBlock key={`R-${child.type}-${i}`} section={child} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section.type === "prototype") {
    return (
      <div className="relative grid items-start gap-x-12 gap-y-10 border-t border-white/25 pt-8 lg:grid-cols-2 lg:pt-12 xl:gap-x-20">
        <div className="w-full max-w-xl">
          <PrototypeText prototype={section.prototype} />
        </div>
        {section.prototype.figures && section.prototype.figures.length > 0 && (
          <FigureRow figures={section.prototype.figures} />
        )}
      </div>
    );
  }

  if (section.type === "figure") {
    const stackGap = "space-y-10";
    if (section.columns && section.columns > 1) {
      return (
        <div
          className={`grid w-full gap-x-8 gap-y-10 sm:gap-x-10 ${
            section.columns === 3
              ? "grid-cols-1 md:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {section.figures.map((fig) => (
            <FigureBlock key={fig.src} figure={fig} />
          ))}
        </div>
      );
    }
    if (section.fullWidth) {
      return (
        <div className={`w-full ${stackGap}`}>
          {section.figures.map((fig) => (
            <FigureBlock key={fig.src} figure={fig} />
          ))}
        </div>
      );
    }
    return (
      <div className="grid items-start gap-x-12 lg:grid-cols-2 xl:gap-x-20">
        <div className="hidden lg:block" aria-hidden />
        <div className={stackGap}>
          {section.figures.map((fig) => (
            <FigureBlock key={fig.src} figure={fig} />
          ))}
        </div>
      </div>
    );
  }

  if (section.type === "part") {
    return <PartHeader section={section} />;
  }

  if (section.type === "table" && section.table.wide) {
    return <TableBlock table={section.table} />;
  }

  if (section.type === "goals" && section.highlight) {
    return (
      <div className="w-full max-w-3xl">
        <SectionBlock section={section} />
      </div>
    );
  }

  return (
    <div className="grid items-start gap-x-12 lg:grid-cols-2 xl:gap-x-20">
      <div className="w-full max-w-xl">
        <SectionBlock section={section} />
      </div>
      <div className="hidden lg:block" aria-hidden />
    </div>
  );
}

function PartHeader({
  section,
}: {
  section: Extract<DetailSection, { type: "part" }>;
}) {
  return (
    <header className="w-full max-w-xl pt-2 lg:pt-4">
      <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.65rem,3.2vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.045em] text-white">
        {section.title}
      </h2>
    </header>
  );
}

function SectionBlock({ section }: { section: DetailSection }) {
  switch (section.type) {
    case "part":
      return <PartHeader section={section} />;

    case "meta":
    case "columns":
      return null;

    case "prose":
      return (
        <section>
          {section.title && (
            <h3 className="mb-4 font-[family-name:var(--font-display)] text-[clamp(0.95rem,1.5vw,1.15rem)] font-bold tracking-[-0.02em] text-white">
              {section.title}
            </h3>
          )}
          <div className="space-y-5">
            {section.paragraphs.map((p, i) => (
              <p
                key={`${i}-${p.slice(0, 24)}`}
                className={`text-[0.8rem] leading-[1.75] tracking-[0.035em] text-white sm:text-[0.88rem] ${
                  section.weight === "normal" ? "font-normal" : "font-bold"
                } ${p.includes("\n") ? "whitespace-pre-line" : ""}`}
              >
                {p}
              </p>
            ))}
          </div>
        </section>
      );

    case "figure":
      return <FigureStack figures={section.figures} />;

    case "table":
      return <TableBlock table={section.table} />;

    case "goals": {
      const compact = Boolean(section.compact);
      const goals = (
        <section
          className={
            section.highlight
              ? "space-y-6 rounded-2xl border border-white/30 bg-white/[0.06] px-5 py-6 sm:px-6 sm:py-7"
              : compact
                ? "space-y-0"
                : "space-y-10"
          }
        >
          {section.heading && (
            <h3 className="mb-4 font-[family-name:var(--font-display)] text-[clamp(0.95rem,1.5vw,1.15rem)] font-bold tracking-[-0.02em] text-white">
              {section.heading}
            </h3>
          )}
          {section.lead && (
            <p className="text-[0.8rem] font-bold leading-[1.75] tracking-[0.035em] text-white sm:text-[0.88rem]">
              {section.lead}
            </p>
          )}
          {section.items.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              className={
                section.highlight
                  ? "border-t border-white/20 pt-5 first:border-t-0 first:pt-0"
                  : compact
                    ? `border-t border-white/25 py-3.5 ${
                        section.lead && i === 0
                          ? "mt-3 border-t-0 pt-0"
                          : "first:border-t-0 first:pt-0"
                      }`
                    : "border-t border-white/25 pt-6"
              }
            >
              <h3
                className={`font-[family-name:var(--font-display)] text-[1rem] font-bold tracking-[-0.02em] text-white ${
                  compact ? "mb-1.5" : "mb-3"
                }`}
              >
                {item.title}
              </h3>
              <p className="text-[0.8rem] font-bold leading-[1.7] tracking-[0.035em] text-white sm:text-[0.88rem]">
                {item.body}
              </p>
            </div>
          ))}
        </section>
      );

      if (!section.offsetTitle) return goals;

      return (
        <div>
          <div
            className="mb-4 font-[family-name:var(--font-display)] text-[clamp(0.95rem,1.5vw,1.15rem)] font-bold tracking-[-0.02em] text-transparent select-none"
            aria-hidden
          >
            &nbsp;
          </div>
          {goals}
        </div>
      );
    }

    case "prototype":
      return <PrototypeText prototype={section.prototype} />;

    default:
      return null;
  }
}

function FigureRow({ figures }: { figures: DetailFigure[] }) {
  const sideBySide = figures.length > 1 && figures.some((f) => (f.scale ?? 1) < 1);
  const mainBoxRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLImageElement>(null);
  const [pairHeight, setPairHeight] = useState<number | null>(null);
  const [thumbWidth, setThumbWidth] = useState<number | null>(null);

  const thumb = sideBySide
    ? figures.find((f) => (f.scale ?? 1) < 1)
    : undefined;
  const main = sideBySide
    ? figures.find((f) => (f.scale ?? 1) >= 1) ?? figures[figures.length - 1]
    : undefined;

  useEffect(() => {
    if (!sideBySide) {
      setPairHeight(null);
      setThumbWidth(null);
      return;
    }
    const mainEl = mainBoxRef.current;
    const thumbEl = thumbRef.current;
    if (!mainEl) return;

    const update = () => {
      const next = mainEl.clientHeight;
      if (next > 0) setPairHeight(next);
      if (thumbEl && thumbEl.clientWidth > 0) {
        setThumbWidth(thumbEl.clientWidth);
      }
    };

    update();
    thumbEl?.addEventListener("load", update);
    const ro = new ResizeObserver(update);
    ro.observe(mainEl);
    if (thumbEl) ro.observe(thumbEl);
    return () => {
      thumbEl?.removeEventListener("load", update);
      ro.disconnect();
    };
  }, [sideBySide, figures]);

  if (!sideBySide || !thumb || !main) {
    return (
      <div className="space-y-10">
        {figures.map((fig) => (
          <FigureBlock key={fig.src} figure={fig} />
        ))}
      </div>
    );
  }

  const captionClass =
    "text-[0.7rem] font-bold italic leading-[1.5] tracking-[0.02em] text-white/55";

  return (
    <div className="relative w-full overflow-visible">
      <div className="relative w-full">
        <div className="mb-3 w-fit lg:absolute lg:top-0 lg:right-full lg:mb-0 lg:mr-3 xl:mr-4">
          <LightboxTrigger src={thumb.src} alt={thumb.alt ?? thumb.caption ?? ""}>
            <SmartImage
              imgRef={thumbRef}
              src={thumb.src}
              alt={thumb.alt ?? thumb.caption ?? ""}
              wrapClassName="overflow-hidden rounded-2xl"
              objectFit="contain"
              className="block h-40 w-auto max-w-none object-contain object-top lg:h-[var(--pair-h,auto)]"
              style={{
                ...figureImageStyle(thumb),
                ...(pairHeight
                  ? ({ "--pair-h": `${pairHeight}px` } as CSSProperties)
                  : null),
              }}
              loading="lazy"
            />
          </LightboxTrigger>
        </div>

        <div ref={mainBoxRef} className="overflow-hidden rounded-2xl">
          {main.video ? (
            <InViewVideo
              src={main.src}
              poster={main.poster}
              className="object-contain"
              soundToggle={Boolean(main.soundToggle)}
            />
          ) : main.gif ? (
            <LightboxTrigger src={main.src} alt={main.alt ?? main.caption ?? ""}>
              <InViewGif
                src={main.src}
                alt={main.alt ?? main.caption ?? ""}
                className="block h-full w-full object-contain"
              />
            </LightboxTrigger>
          ) : (
            <LightboxTrigger src={main.src} alt={main.alt ?? main.caption ?? ""}>
              <SmartImage
                src={main.src}
                alt={main.alt ?? main.caption ?? ""}
                wrapClassName="w-full"
                objectFit="contain"
                className="block h-auto w-full object-contain"
                style={figureImageStyle(main)}
                loading="lazy"
              />
            </LightboxTrigger>
          )}
        </div>
      </div>

      {(thumb.caption || main.caption) && (
        <div className="relative mt-4 flex w-full items-start gap-3 lg:gap-0">
          {thumb.caption && (
            <figcaption
              className={`shrink-0 lg:absolute lg:right-full lg:mr-3 xl:mr-4 ${captionClass}`}
              style={thumbWidth ? { width: thumbWidth } : undefined}
            >
              {thumb.caption}
            </figcaption>
          )}
          {main.caption && (
            <figcaption className={`min-w-0 flex-1 ${captionClass}`}>
              {main.caption}
            </figcaption>
          )}
        </div>
      )}
    </div>
  );
}

function InViewGif({
  src,
  alt,
  className,
  mediaRef,
}: {
  src: string;
  alt?: string;
  className?: string;
  mediaRef?: RefObject<HTMLImageElement | null>;
}) {
  const { ref: wrapRef, inView } = useInView<HTMLDivElement>({
    once: false,
    threshold: 0.35,
  });
  const [poster, setPoster] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const probedRatio = useMediaDimensions(src);

  // Capture a still first frame so the image stays visible when off-screen
  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    setPoster(null);
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx || img.naturalWidth === 0) {
          setPoster(src);
          return;
        }
        ctx.drawImage(img, 0, 0);
        setPoster(canvas.toDataURL("image/jpeg", 0.88));
      } catch {
        setPoster(src);
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setFailed(true);
        setPoster(null);
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  const displaySrc = failed ? undefined : inView ? src : (poster ?? undefined);
  const waiting = !failed && !displaySrc;
  const aspectRatio = probedRatio ?? "16 / 9";

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-2xl bg-white/[0.03]"
      style={{ aspectRatio: String(aspectRatio), width: "100%" }}
    >
      {(waiting || failed) && (
        <LoadingMark
          className="absolute inset-0 z-[1]"
          posterSrc={src}
          objectFit="contain"
          showSpinner={waiting}
        />
      )}
      {displaySrc ? (
        <img
          ref={mediaRef}
          src={displaySrc}
          alt={alt ?? ""}
          className={className}
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}

function InViewVideo({
  src,
  poster,
  className,
  mediaRef,
  soundToggle = false,
}: {
  src: string;
  poster?: string;
  className?: string;
  mediaRef?: RefObject<HTMLImageElement | HTMLVideoElement | null>;
  soundToggle?: boolean;
}) {
  const localRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const probedRatio = useVideoDimensions(src);

  useEffect(() => {
    setReady(false);
    setFailed(false);
    setMuted(true);
  }, [src]);

  useEffect(() => {
    const video = localRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  }, [src]);

  useEffect(() => {
    const video = localRef.current;
    if (!video || !ready || failed) return;
    video.muted = muted;
    video.defaultMuted = muted;
    const tryPlay = () => {
      void video.play().catch(() => {});
    };
    tryPlay();
    video.addEventListener("canplay", tryPlay);
    return () => video.removeEventListener("canplay", tryPlay);
  }, [ready, muted, src, failed]);

  const toggleSound = () => {
    const video = localRef.current;
    if (!video) return;
    const nextMuted = !muted;
    setMuted(nextMuted);
    video.muted = nextMuted;
    video.defaultMuted = nextMuted;
    void video.play().catch(() => {});
  };

  const markReady = () => {
    setFailed(false);
    setReady(true);
  };

  const fitClass = className?.includes("object-contain")
    ? "object-contain"
    : "object-cover";
  const aspectRatio = probedRatio ?? 16 / 9;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black"
      style={{ aspectRatio: String(aspectRatio), width: "100%" }}
    >
      <video
        key={src}
        ref={(el) => {
          localRef.current = el;
          if (mediaRef) {
            (
              mediaRef as MutableRefObject<
                HTMLImageElement | HTMLVideoElement | null
              >
            ).current = el;
          }
        }}
        src={src}
        {...(poster ? { poster } : {})}
        className={`absolute inset-0 z-0 h-full w-full ${fitClass}`}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        onLoadedMetadata={markReady}
        onLoadedData={markReady}
        onCanPlay={markReady}
        onPlaying={markReady}
        onError={() => setFailed(true)}
      />

      {!ready && !failed && (
        <LoadingMark
          className="pointer-events-none absolute inset-0 z-[1]"
          showSpinner
          label="Loading video"
          posterSrc={poster}
          objectFit={fitClass === "object-contain" ? "contain" : "cover"}
        />
      )}

      {failed && (
        <LoadingMark
          className="pointer-events-none absolute inset-0 z-[1]"
          showSpinner={false}
          label="Media unavailable"
          posterSrc={poster}
          objectFit={fitClass === "object-contain" ? "contain" : "cover"}
        />
      )}

      {soundToggle && ready && !failed && (
        <button
          type="button"
          onClick={toggleSound}
          className="absolute bottom-3 right-3 z-[2] rounded-full border border-white/25 bg-black/55 px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.04em] text-white backdrop-blur-sm transition-opacity hover:bg-black/75"
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? "开启声音" : "静音"}
        </button>
      )}
    </div>
  );
}

function figureImageStyle(figure: DetailFigure): CSSProperties | undefined {
  const filters: string[] = [];
  if (figure.grayscale) filters.push("grayscale(1)");
  if (figure.invert) filters.push("invert(1)");
  return filters.length ? { filter: filters.join(" ") } : undefined;
}

function FigureStack({ figures }: { figures: DetailFigure[] }) {
  const nodes: ReactNode[] = [];
  let i = 0;
  while (i < figures.length) {
    const fig = figures[i];
    const next = figures[i + 1];
    if (fig.row && next?.row) {
      nodes.push(
        <div
          key={`${fig.src}__${next.src}`}
          className="flex w-full items-start justify-between gap-4 sm:gap-5"
        >
          <FigureBlock figure={fig} flush className="w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.625rem)]" />
          <FigureBlock figure={next} flush className="w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.625rem)]" />
        </div>,
      );
      i += 2;
      continue;
    }
    nodes.push(<FigureBlock key={fig.src} figure={fig} />);
    i += 1;
  }
  return <div className="space-y-6 lg:space-y-8">{nodes}</div>;
}

function ChartFrame({ figure }: { figure: DetailFigure }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [squareH, setSquareH] = useState<number | undefined>(undefined);
  const [leftH, setLeftH] = useState<number | undefined>(undefined);
  const chrome = figure.chrome ?? 76;

  useLayoutEffect(() => {
    if (!figure.squarePlot) return;
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setSquareH(el.clientWidth + chrome);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [figure.squarePlot, chrome]);

  useLayoutEffect(() => {
    if (!figure.matchLeft) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const left = wrap
      .closest("[data-case-columns]")
      ?.querySelector("[data-case-left]");
    if (!(left instanceof HTMLElement)) return;
    const measure = () => {
      const next = Math.round(left.getBoundingClientRect().height);
      if (next > 0) setLeftH(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(left);
    return () => ro.disconnect();
  }, [figure.matchLeft]);

  const height = figure.height ?? 520;
  const framed = Boolean(figure.aspect) && !figure.squarePlot && !figure.matchLeft;
  const boxStyle = figure.matchLeft
    ? { height: leftH ?? 320 }
    : figure.squarePlot
      ? { height: squareH ?? undefined }
      : framed
        ? { aspectRatio: figure.aspect }
        : { height };

  return (
    <div ref={wrapRef} className="relative w-full" style={boxStyle}>
      <iframe
        src={figure.src}
        title={figure.alt ?? figure.caption ?? "Chart"}
        className="absolute inset-0 block h-full w-full border-0 bg-transparent"
        style={{ overflow: "hidden" }}
        scrolling="no"
      />
    </div>
  );
}

function FigureBlock({
  figure,
  className = "",
  flush = false,
}: {
  figure: DetailFigure;
  className?: string;
  /** Ignore scale width so the parent row controls sizing */
  flush?: boolean;
}) {
  const scale = figure.scale ?? 1;
  const widthStyle =
    !flush && scale < 1
      ? { width: `${scale * 100}%`, maxWidth: "100%" as const }
      : undefined;
  const fixedFrame = Boolean(figure.aspect);
  const coverFit = figure.fit === "cover" || fixedFrame;

  if (figure.embed) {
    return (
      <figure className={`min-w-0 w-full ${className}`}>
        <div
          className={`overflow-hidden bg-transparent ${
            figure.rounded ? "rounded-[24px]" : ""
          }`}
          style={widthStyle}
        >
          <ChartFrame figure={figure} />
        </div>
        {figure.caption && (
          <figcaption className="mt-3 text-[0.7rem] font-bold italic leading-[1.5] tracking-[0.02em] text-white/55">
            {figure.caption}
          </figcaption>
        )}
        {figure.body && (
          <p className="mt-3 text-[0.8rem] font-bold leading-[1.7] tracking-[0.035em] text-white sm:text-[0.88rem]">
            {figure.body}
          </p>
        )}
      </figure>
    );
  }

  return (
    <figure className={`min-w-0 ${flush ? "w-full" : "w-full"} ${className}`}>
      <div
        className="overflow-hidden rounded-2xl bg-transparent"
        style={{
          ...widthStyle,
          ...(figure.aspect ? { aspectRatio: figure.aspect } : null),
        }}
      >
        {figure.video ? (
          <InViewVideo
            src={figure.src}
            poster={figure.poster}
            className={
              fixedFrame
                ? "object-cover"
                : "object-contain"
            }
            soundToggle={Boolean(figure.soundToggle)}
          />
        ) : figure.gif ? (
          <LightboxTrigger
            src={figure.src}
            alt={figure.alt ?? figure.caption ?? ""}
          >
            <InViewGif
              src={figure.src}
              alt={figure.alt ?? figure.caption ?? ""}
              className={
                fixedFrame
                  ? "h-full w-full object-cover"
                  : "h-auto w-full object-contain"
              }
            />
          </LightboxTrigger>
        ) : (
          <LightboxTrigger
            src={figure.src}
            alt={figure.alt ?? figure.caption ?? ""}
          >
            <SmartImage
              src={figure.src}
              alt={figure.alt ?? figure.caption ?? ""}
              wrapClassName={fixedFrame ? "h-full w-full" : "w-full"}
              objectFit={coverFit ? "cover" : "contain"}
              className={
                fixedFrame
                  ? "h-full w-full object-cover"
                  : "h-auto w-full object-contain"
              }
              style={figureImageStyle(figure)}
              loading="lazy"
            />
          </LightboxTrigger>
        )}
      </div>
      {figure.caption && (
        <figcaption
          className="mt-3 text-[0.7rem] font-bold italic leading-[1.5] tracking-[0.02em] text-white/55"
          style={!flush && scale < 1 ? { maxWidth: `${scale * 100}%` } : undefined}
        >
          {figure.caption}
        </figcaption>
      )}
      {figure.body && (
        <p
          className="mt-3 text-[0.8rem] font-bold leading-[1.7] tracking-[0.035em] text-white sm:text-[0.88rem]"
          style={!flush && scale < 1 ? { maxWidth: `${scale * 100}%` } : undefined}
        >
          {figure.body}
        </p>
      )}
    </figure>
  );
}

function TableBlock({ table }: { table: DetailTable }) {
  const compact = Boolean(table.compact);
  const headPad = compact
    ? "px-1.5 py-2 sm:px-2"
    : "px-2.5 py-2.5 first:pl-0 sm:px-3";

  return (
    <figure className="w-full overflow-x-auto">
      <table
        className={`min-w-full border-collapse text-left ${
          compact ? "text-[0.65rem] sm:text-[0.72rem]" : "text-[0.7rem] sm:text-[0.78rem]"
        }`}
      >
        <thead>
          {table.groups && (
            <tr className="border-b border-white/20 bg-white/[0.06]">
              {table.groups.map((g, i) => (
                <th
                  key={`${g.label}-${i}`}
                  colSpan={g.span}
                  className={`${headPad} font-bold tracking-[0.02em] text-white ${
                    i === 0 ? "text-left" : "text-center"
                  }`}
                >
                  {g.label}
                </th>
              ))}
            </tr>
          )}
          <tr className="border-b border-white/25 bg-white/[0.06]">
            {table.headers.map((h, i) => (
              <th
                key={`${h}-${i}`}
                className={`${headPad} font-bold tracking-[0.02em] text-white ${
                  i === 0 ? "text-left" : "text-center"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr
              key={`${row[0]}-${rowIndex}`}
              className={`border-b border-white/15 ${
                rowIndex % 2 === 0 ? "bg-white/[0.03]" : "bg-transparent"
              }`}
            >
              {row.map((cellValue, i) => (
                <td
                  key={`${row[0]}-${i}`}
                  className={`${
                    compact ? "px-1.5 py-1.5 sm:px-2" : "px-2.5 py-2 first:pl-0 sm:px-3"
                  } font-bold text-white ${i === 0 ? "text-left" : "text-center tabular-nums"}`}
                >
                  {cellValue || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.caption && (
        <figcaption className="mt-4 text-[0.7rem] font-bold italic leading-[1.5] text-white/55">
          {table.caption}
        </figcaption>
      )}
    </figure>
  );
}

function PrototypeText({ prototype }: { prototype: DetailPrototype }) {
  return (
    <section>
      <p className="mb-2 text-[0.72rem] font-bold tracking-[0.08em] text-white">
        {prototype.index}
        {prototype.device ? ` · ${prototype.device}` : ""}
      </p>
      <h3 className="mb-4 font-[family-name:var(--font-display)] text-[clamp(1.1rem,2vw,1.45rem)] font-bold leading-[1.15] tracking-[-0.03em] text-white">
        {prototype.title}
      </h3>
      {prototype.based && (
        <p className="mb-4 text-[0.75rem] font-bold tracking-[0.04em] text-white">
          Based · {prototype.based}
        </p>
      )}
      {prototype.bullets && prototype.bullets.length > 0 && (
        <ul className="mb-2 space-y-2 text-[0.8rem] font-bold leading-[1.7] tracking-[0.035em] text-white sm:text-[0.88rem]">
          {prototype.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      {prototype.body && (
        <div className="space-y-3">
          {prototype.body.map((p) => (
            <p
              key={p.slice(0, 24)}
              className="text-[0.8rem] font-bold leading-[1.75] tracking-[0.035em] text-white sm:text-[0.88rem]"
            >
              {p}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
