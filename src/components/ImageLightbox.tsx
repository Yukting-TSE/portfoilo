import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type LightboxItem = { src: string; alt: string };

const LightboxContext = createContext<(item: LightboxItem) => void>(() => {});

export function useLightbox() {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<LightboxItem | null>(null);
  const close = useCallback(() => setItem(null), []);

  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, close]);

  return (
    <LightboxContext.Provider value={setItem}>
      {children}
      {item && (
        <div
          className="fixed inset-0 z-[180] flex items-center justify-center bg-black/88 p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="查看大图"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-5 right-5 text-[0.8rem] font-bold tracking-[0.04em] text-white/70 transition-opacity hover:text-white"
          >
            关闭
          </button>
          <img
            src={item.src}
            alt={item.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[min(92vw,1600px)] object-contain"
          />
        </div>
      )}
    </LightboxContext.Provider>
  );
}

export function LightboxTrigger({
  src,
  alt,
  className = "",
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  children: ReactNode;
}) {
  const open = useLightbox();
  return (
    <button
      type="button"
      onClick={() => open({ src, alt })}
      className={`block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left ${className}`}
      aria-label={alt ? `查看大图：${alt}` : "查看大图"}
    >
      {children}
    </button>
  );
}
