import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AboutIntro } from "../components/AboutIntro";
import { ContactOverlay } from "../components/ContactOverlay";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { HeroField } from "../components/HeroField";
import { MobileMenu } from "../components/MobileMenu";
import { Navigation } from "../components/Navigation";
import { SelectedWork } from "../components/SelectedWork";

export function HomePage() {
  const { hash } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [navOpacity, setNavOpacity] = useState(1);

  useEffect(() => {
    document.body.style.overflow = menuOpen || contactOpen ? "hidden" : "";
  }, [menuOpen, contactOpen]);

  // Keep first paint on the hero unless the URL explicitly targets a section.
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [hash]);

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
      <main>
        <HeroField />
        <Hero />
        <AboutIntro />
        <SelectedWork />
      </main>
      <Footer onOpenContact={() => setContactOpen(true)} />
    </>
  );
}
