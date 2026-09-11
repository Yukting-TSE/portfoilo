import { animate } from "animejs";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { categories, projectPath, type Project } from "../data/projects";
import { useInView } from "../hooks/useInView";
import { motion } from "../motion/motionConfig";

function methodTags(method: string) {
  return (method ?? "")
    .split(/[·•|,/；;，、]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function projectKeywordTags(project: Project) {
  const fromDetail = project.detail?.meta?.find((m) => m.label === "Keyword")
    ?.value;
  return methodTags(fromDetail ?? project.method);
}

function useDesktopScale() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return enabled;
}

export function SelectedWork() {
  const [active, setActive] = useState(categories[0]?.id ?? "hci");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".works-cat")
    );
    if (!sections.length) return;

    const updateActive = () => {
      const line = window.innerHeight * 0.28;
      let next = sections[0]?.getAttribute("data-cat") ?? "hci";
      for (const section of sections) {
        const top = section.getBoundingClientRect().top;
        if (top <= line) {
          next = section.getAttribute("data-cat") ?? next;
        }
      }
      setActive((prev) => (prev === next ? prev : next));
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return (
    <section
      id="works"
      className="relative z-[3] grid grid-cols-1 border-t border-[var(--line)] bg-[var(--bg)] lg:grid-cols-[12rem_minmax(0,1fr)]"
    >
      <aside
        className="z-[5] border-b border-[var(--line)] bg-[var(--bg)] lg:min-h-full lg:self-stretch lg:border-b-0 lg:border-r lg:border-[var(--line)]"
        aria-label="作品分类"
      >
        <div className="flex gap-4 overflow-x-auto px-5 py-4 lg:sticky lg:top-[5.25rem] lg:flex-col lg:gap-1 lg:overflow-visible lg:px-6 lg:pb-10 lg:pt-10">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#cat-${cat.id}`}
              onClick={(e) => {
                e.preventDefault();
                setActive(cat.id);
                const el = document.getElementById(`cat-${cat.id}`);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.history.replaceState(null, "", `#cat-${cat.id}`);
                }
              }}
              className={`group relative shrink-0 whitespace-nowrap py-1.5 text-[0.95rem] tracking-[0.02em] transition-all duration-300 ${
                active === cat.id
                  ? "translate-x-0 text-[var(--fg)] lg:translate-x-1"
                  : "text-[var(--gray)] hover:translate-x-1 hover:text-[var(--fg)]"
              }`}
            >
              <span
                className={`mr-2 inline-block h-[1px] w-0 align-middle transition-all duration-300 group-hover:w-3 ${
                  active === cat.id
                    ? "w-3 bg-[var(--fg)]"
                    : "bg-[var(--gray)]"
                }`}
                aria-hidden
              />
              {cat.label}
            </a>
          ))}
        </div>
      </aside>

      <div className="px-5 pb-24 pt-10 sm:px-8 lg:px-10 lg:pb-36 lg:pt-14">
        {categories.map((cat) => (
          <section
            key={cat.id}
            data-cat={cat.id}
            className="works-cat mt-16 border-t border-[var(--line)] pt-16 first:mt-0 first:border-t-0 first:pt-0 sm:mt-24 sm:pt-20 lg:mt-36 lg:pt-28 lg:first:mt-0 lg:first:pt-0"
          >
            <CategoryHeading id={`cat-${cat.id}`} label={cat.label} />

            <div className="flex flex-col gap-20 lg:gap-28">
              {cat.projects.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function CategoryHeading({ id, label }: { id: string; label: string }) {
  const { hash } = useLocation();
  const hashTarget =
    hash === `#${id}` || hash.replace(/^#/, "") === id;
  const { ref, inView } = useInView<HTMLHeadingElement>({ threshold: 0.35 });
  const played = useRef(hashTarget);
  // First category used to land correctly with larger offset; others need
  // a bit more room under the fixed nav so the title sits lower.
  const scrollMt =
    id === "cat-hci"
      ? "scroll-mt-28 lg:scroll-mt-32"
      : "scroll-mt-16 lg:scroll-mt-20";

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || played.current) {
      if (el && hashTarget) {
        el.style.opacity = "1";
        el.style.transform = "none";
      }
      return;
    }
    played.current = true;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    animate(el, {
      opacity: [0, 1],
      translateY: [40, 0],
      duration: motion.slow,
      ease: "inOutCubic",
    });
  }, [inView, ref, hashTarget]);

  return (
    <h2
      id={id}
      ref={ref}
      className={`mb-14 font-[family-name:var(--font-display)] text-[clamp(2.5rem,5.5vw,4rem)] font-bold leading-[0.95] tracking-[-0.045em] text-[var(--fg)] lg:mb-20 ${scrollMt}`}
      style={{ opacity: hashTarget ? 1 : 0 }}
    >
      {label}
    </h2>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const ref = useRef<HTMLElement | null>(null);
  const [focused, setFocused] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const desktopScale = useDesktopScale();
  const tags = projectKeywordTags(project);
  const summary = `${project.challenge} ${project.approach}`.trim();
  const image = project.images[0];
  const scale = desktopScale ? (focused ? 1 : 0.85) : 1;
  const href = project.href || projectPath(project.id);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFocused(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        setFocused(entry.isIntersecting);
      },
      {
        threshold: [0.2, 0.35, 0.5],
        rootMargin: "-22% 0px -28% 0px",
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={ref} className="project-row">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,32%)_minmax(0,68%)] lg:gap-10 xl:gap-14">
        <div
          className="flex min-h-0 flex-col justify-between gap-8 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:gap-10 lg:py-1"
          style={{
            color:
              focused || !desktopScale ? "var(--fg)" : "rgba(245,245,242,0.32)",
          }}
        >
          <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.25rem,2.2vw,1.85rem)] font-bold leading-[1.15] tracking-[-0.03em]">
            <Link
              to={href}
              className="transition-opacity duration-300 hover:opacity-55"
            >
              {project.title}
            </Link>
          </h3>
          <p
            className="max-w-md text-[0.85rem] leading-[1.7] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:text-[0.9rem]"
            style={{
              color:
                focused || !desktopScale
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(255,255,255,0.28)",
            }}
          >
            {summary}
          </p>
        </div>

        <div className="relative aspect-video w-full shrink-0 self-start overflow-hidden rounded-2xl">
          <Link
            to={href}
            className="absolute inset-0 block cursor-none overflow-hidden rounded-2xl will-change-transform"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "right center",
              transition: desktopScale
                ? "transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)"
                : "none",
            }}
            aria-label={`View project: ${project.title}`}
            onMouseEnter={(e) => setCursor({ x: e.clientX, y: e.clientY })}
            onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
            onMouseLeave={() => setCursor(null)}
          >
            <img
              src={image}
              alt=""
              loading="lazy"
              width={1600}
              height={900}
              className="h-full w-full object-cover object-center"
            />
            {tags.length > 0 && (
              <div className="pointer-events-none absolute left-3 top-3 z-[2] flex max-w-[90%] flex-wrap gap-2 sm:left-4 sm:top-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white bg-white/35 px-3 py-[0.4em] text-[11px] leading-none tracking-[0.02em] text-white backdrop-blur-[2px] sm:text-[12px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        </div>
      </div>

      {cursor && (
        <span
          className="pointer-events-none fixed z-[200] bg-black px-2.5 py-[0.35em] font-[family-name:var(--font-display)] text-[11px] font-semibold leading-none tracking-[-0.01em] text-white sm:text-[12px]"
          style={{ left: cursor.x, top: cursor.y }}
          aria-hidden
        >
          &gt;View project&lt;
        </span>
      )}
    </article>
  );
}
