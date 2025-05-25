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
    // const sections = ["home", "features", "colors", "pricing"];
    const sections = ["home", "features", "pricing"];

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
  }, []);

  /* ---- items ---- */
  const navItems = [
    { id: "home", name: "Home", cb: onHomeClick },
    { id: "features", name: "Features", cb: onFeaturesClick },
    { id: "pricing", name: "Pricing", cb: onPricingClick },
    // { id: "support", name: "Support", cb: onSupportClick },
  ];

  /* ---- render ---- */
  return (
    <motion.nav
      className={`fixed inset-x-0 top-0 z-40 px-6 py-4 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/80 backdrop-blur-xl shadow-lg"
          : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Apple Logo */}
        <div className="flex items-center">
          <img src="/apple-logo.svg" alt="Apple" className="h-8 mr-6" />
        </div>

        {/* desktop links */}
        <div className="hidden gap-8 md:flex">
          {navItems.map(({ id, name, cb }) => (
            <motion.button
              key={id}
              onClick={cb}
              className={`relative px-4 py-2 text-sm font-medium transition-colors hover:text-white ${
                active === id ? "text-white" : "text-gray-400"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {name}
              {active === id && (
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                  layoutId="activeTab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* mobile burger */}
        <motion.button
          className="rounded-full bg-white/10 backdrop-blur-md p-2.5 text-white md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: mobileOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {mobileOpen ? "✕" : "☰"}
          </motion.div>
        </motion.button>
      </div>

      {/* mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 top-[72px] z-50 bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col space-y-2 p-6">
              {navItems.map(({ id, name, cb }, i) => (
                <motion.button
                  key={id}
                  onClick={() => {
                    cb();
                    setMobileOpen(false);
                  }}
                  className={`w-full rounded-lg py-4 text-center text-xl font-medium ${
                    active === id ? "bg-white/10 text-white" : "text-gray-400"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.98 }}
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
