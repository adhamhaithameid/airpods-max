import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({
  onHomeClick,
  onFeaturesClick,
  onPricingClick,
  onSupportClick,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");

  /* ---- scroll listener (throttled with rAF) ---- */
  useEffect(() => {
    let ticking = false;
    const sections = ["home", "features", "colors", "pricing"];

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // Update scrolled state based on scroll position
        setScrolled(window.scrollY > 50);

        // Find current section in viewport
        const current = sections.find((id) => {
          const el = document.getElementById(id);
          if (!el) return false;
          const { top, bottom } = el.getBoundingClientRect();
          return top <= 100 && bottom >= 100;
        });
        
        if (current) setActive(current);
        ticking = false;
      });
    };

    // Initial call to set correct state on mount
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);}]}}

  /* ---- items ---- */
  const navItems = [
    { id: "home", name: "Home", cb: onHomeClick },
    { id: "features", name: "Features", cb: onFeaturesClick },
    { id: "pricing", name: "Pricing", cb: onPricingClick },
    { id: "support", name: "Support", cb: onSupportClick },
  ];

  /* ---- render ---- */
  return (
    <motion.nav
      className={`fixed inset-x-0 top-0 z-40 px-6 py-4 transition-colors ${
        scrolled
          ? "border-b border-white/10 bg-background/90 backdrop-blur-xl shadow-lg"
          : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* desktop links */}
        <div className="hidden gap-12 md:flex">
          {navItems.map(({ id, name, cb }) => (
            <button
              key={id}
              onClick={cb}
              className={`relative text-primary_text transition-colors hover:text-white ${
                active === id && "text-white"
              }`}
            >
              {name}
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 w-full bg-white"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: active === id ? 1 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
            </button>
          ))}
        </div>

        {/* mobile burger */}
        <button
          className="rounded-lg bg-button_dark/70 p-2 text-white md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 top-[72px] z-50 bg-background/95 backdrop-blur-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col space-y-6 p-6">
              {navItems.map(({ id, name, cb }, i) => (
                <motion.button
                  key={id}
                  onClick={() => {
                    cb();
                    setMobileOpen(false);
                  }}
                  className={`w-full border-b border-white/10 py-3 text-left text-xl ${
                    active === id ? "text-white" : "text-primary_text"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
