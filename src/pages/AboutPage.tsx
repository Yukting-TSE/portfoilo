import { useEffect, useLayoutEffect, useState } from "react";
import { ContactOverlay } from "../components/ContactOverlay";
import { Footer } from "../components/Footer";
import { MobileMenu } from "../components/MobileMenu";
import { Navigation } from "../components/Navigation";
import { aboutDetail } from "../data/about";
import { CaseStudy } from "./ProjectPage";

export function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [navOpacity, setNavOpacity] = useState(1);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

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
      setNavOpacity(Math.min(1, Math.max(0, top / vh)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
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
        <CaseStudy
          title={`${aboutDetail.headline}`}
          detail={aboutDetail}
        />
      </main>

      <Footer onOpenContact={() => setContactOpen(true)} />
    </>
  );
}
