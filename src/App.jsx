import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AirpodsVariant, { VARIANTS } from "./components/AirpodsVariant";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef(null);
  const airpodsRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("space-gray");
  const [currentCurrency, setCurrency] = useState("USD");
  const [activeSection, setActiveSection] = useState("home");
  const [horizontalScrollActive, setHorizontalScrollActive] = useState(false);

  // Colors available for AirPods Max
  const colors = VARIANTS.map((variant) => variant.id);

  // Pricing in different currencies
  const pricing = {
    USD: 549,
    EUR: 499,
    GBP: 449,
    JPY: 60000,
    CAD: 699,
  };

  // Scroll animation setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end"],
  });

  // Transform values based on scroll
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [1, 0.8, 0.6, 0.4]
  );
  const rotation = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, 90, 180, 270, 360]
  );
  const xPosition = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["0%", "-25%", "0%", "25%", "0%"]
  );

  // Initialize animations
  useEffect(() => {
    // Initial glow animation with enhanced effects
    gsap.fromTo(
      airpodsRef.current,
      { opacity: 0, filter: "blur(20px)", y: 50 },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 1.8,
        ease: "power3.out",
      }
    );

    // Horizontal scroll section
    const horizontalSection = document.querySelector(".horizontal-scroll");

    if (horizontalSection) {
      const colorSections = gsap.utils.toArray(".color-section");

      // Set the width of the colors container to accommodate all sections
      const colorsContainer =
        horizontalSection.querySelector(".colors-container");
      if (!colorsContainer) return;

      // Clear any existing ScrollTriggers to prevent conflicts
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === horizontalSection) {
          st.kill();
        }
      });

      // Create horizontal scroll animation with improved configuration
      const totalDistance = colorSections.length * 100;

      // Set up the colors container for horizontal scrolling
      gsap.set(colorsContainer, {
        width: `${colorSections.length * 100}%`,
        display: "flex",
        flexDirection: "row",
        position: "relative", // Add position relative to fix scroll calculation
      });

      // Ensure each color section has the correct width
      colorSections.forEach((section) => {
        gsap.set(section, {
          width: "100%",
          flex: "0 0 100%",
          position: "relative", // Add position relative to fix scroll calculation
        });
      });

      // Main ScrollTrigger for pinning the section
      ScrollTrigger.create({
        trigger: horizontalSection,
        start: "top top",
        end: () => `+=${totalDistance}vh`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1, // Helps with smoother pinning
        onEnter: () => setHorizontalScrollActive(true),
        onLeaveBack: () => setHorizontalScrollActive(false),
        scrub: 1, // Smoother scrubbing with a small delay
        invalidateOnRefresh: true, // Recalculate on window resize
        markers: false, // Set to true for debugging
      });

      // Create color change animation with improved configuration
      gsap.to(colorsContainer, {
        x: () => -(colorsContainer.offsetWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalSection,
          start: "top top",
          end: () => `+=${totalDistance}vh`,
          scrub: 1,
          snap: {
            snapTo: 1 / (colorSections.length - 1),
            duration: 0.3,
            ease: "power1.inOut",
          },
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Calculate which color section is active
            const progress = self.progress;
            const colorIndex = Math.min(
              Math.floor(progress * colors.length),
              colors.length - 1
            );
            setCurrentColor(colors[colorIndex]);
          },
        },
      });
    }

    // Create scroll progress indicator
    const progressBar = document.querySelector(".scroll-progress-bar");
    if (progressBar) {
      gsap.to(progressBar, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    }
  }, [colors]);

  // Handle navigation and section detection
  const handleNavigation = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Add scroll-based section detection
  useEffect(() => {
    const sections = ["home", "features", "colors", "pricing"];

    // Create ScrollTrigger for each section to update active section
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        ScrollTrigger.create({
          trigger: element,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => setActiveSection(sectionId),
          onEnterBack: () => setActiveSection(sectionId),
        });
      }
    });
  }, []);

  // Handle currency change
  const handleCurrencyChange = (currency) => {
    setCurrency(currency);
  };

  return (
    <div
      className="app-container"
      ref={containerRef}
      style={{ position: "relative" }}
    >
      {/* Navigation with Scroll Progress Indicator */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-black bg-opacity-80 backdrop-blur-md">
        {/* Scroll Progress Indicator */}
        <div className="scroll-progress-container w-full h-1 bg-gray-800">
          <div className="scroll-progress-bar h-full bg-white w-0"></div>
        </div>

        <div className="flex justify-between items-center p-4">
          <div className="flex-1">
            <span className="text-white font-bold text-xl">AirPods Max</span>
          </div>

          <div className="flex items-center space-x-2 md:space-x-6">
            <button
              className={`nav-button relative px-4 py-2 text-white transition-all duration-300 ${
                activeSection === "home"
                  ? "font-bold"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => handleNavigation("home")}
            >
              Home
              {activeSection === "home" && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-white w-full"
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
            <button
              className={`nav-button relative px-4 py-2 text-white transition-all duration-300 ${
                activeSection === "features"
                  ? "font-bold"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => handleNavigation("features")}
            >
              Features
              {activeSection === "features" && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-white w-full"
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
            <button
              className={`nav-button relative px-4 py-2 text-white transition-all duration-300 ${
                activeSection === "colors"
                  ? "font-bold"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => handleNavigation("colors")}
            >
              Colors
              {activeSection === "colors" && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-white w-full"
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
            <button
              className={`nav-button relative px-4 py-2 text-white transition-all duration-300 ${
                activeSection === "pricing"
                  ? "font-bold"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => handleNavigation("pricing")}
            >
              Pricing
              {activeSection === "pricing" && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-white w-full"
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="hero-section min-h-screen flex flex-col justify-center items-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #121212 0%, #2a2a2a 100%)",
        }}
      >
        <motion.div
          ref={airpodsRef}
          className="airpods-model"
          style={{
            width: "500px",
            height: "500px",
            perspective: "1000px",
          }}
        >
          {/* Official Apple product images with ErrorBoundary */}
          <ErrorBoundary fallbackColor={currentColor}>
            <AirpodsVariant
              color={currentColor}
              scale={scale}
              rotation={rotation}
              xPosition={xPosition}
            />
          </ErrorBoundary>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl font-bold mt-8 text-white"
        >
          AirPods Max
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-xl text-gray-300 mt-4 max-w-md text-center"
        >
          Introducing a new sound experience. Computational audio. Adaptive EQ.
          Active Noise Cancellation. Transparency mode.
        </motion.p>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="features-section min-h-screen flex flex-col justify-center"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{
                width: "100%",
                height: "400px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {VARIANTS.find((v) => v.id === currentColor) && (
                <div
                  className="airpods-feature-image"
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "400px",
                    position: "relative",
                    filter: `drop-shadow(0 0 30px ${
                      VARIANTS.find((v) => v.id === currentColor).glow
                    })`,
                  }}
                >
                  <img
                    src={VARIANTS.find((v) => v.id === currentColor).url}
                    alt={`AirPods Max - ${currentColor}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
            </motion.div>
            <motion.div
              className="md:w-1/2 text-left"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                Immersive Listening
              </h2>
              <p className="text-gray-300 text-lg mb-4">
                The custom-built driver delivers undistorted audio across the
                entire audible range.
              </p>
              <p className="text-gray-300 text-lg mb-4">
                Computational audio combines custom acoustic design with the
                Apple H1 chip and software for breakthrough listening
                experiences.
              </p>
              <p className="text-gray-300 text-lg">
                Adaptive EQ tailors sound to the bespoke fit and seal created by
                the ear cushions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Colors Section with Horizontal Scroll */}
      <section
        id="colors"
        className="horizontal-scroll min-h-screen relative overflow-hidden"
      >
        <div className="colors-container">
          {VARIANTS.map((variant, index) => (
            <div
              key={variant.id}
              className="color-section min-h-screen flex items-center justify-center"
            >
              <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                <motion.div
                  className={`airpods-color-display ${
                    index % 2 === 0
                      ? "order-1 md:order-1"
                      : "order-1 md:order-2"
                  }`}
                  style={{
                    width: "500px",
                    height: "500px",
                    position: "relative",
                    filter: `drop-shadow(0 0 30px ${variant.glow})`,
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={variant.url}
                    alt={`AirPods Max - ${variant.name}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </motion.div>
                <motion.div
                  className={`text-content ${
                    index % 2 === 0
                      ? "order-2 md:order-2"
                      : "order-2 md:order-1"
                  } text-left md:w-1/2`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl font-bold mb-6 text-white capitalize">
                    {variant.name}
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Express yourself with a splash of color. AirPods Max come in
                    five stunning colors to complement your style.
                  </p>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="pricing-section min-h-screen flex flex-col justify-center"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-bold mb-12 text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Choose Your AirPods Max
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {VARIANTS.map((variant) => (
              <motion.div
                key={variant.id}
                className={`color-option cursor-pointer ${
                  currentColor === variant.id ? "selected" : ""
                }`}
                onClick={() => setCurrentColor(variant.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                  border:
                    currentColor === variant.id
                      ? `3px solid ${variant.glow}`
                      : "3px solid transparent",
                  boxShadow:
                    currentColor === variant.id
                      ? `0 0 15px ${variant.glow}`
                      : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="color-preview"
                  style={{
                    backgroundImage: `url(${variant.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "100%",
                    transform: "scale(1.5)",
                  }}
                ></div>
                <p className="text-white mt-2 capitalize text-center">
                  {variant.name}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="pricing-display mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center">
              <div
                className="small-airpods-icon mr-4"
                style={{ width: "60px", height: "60px", overflow: "hidden" }}
              >
                {VARIANTS.find((v) => v.id === currentColor) && (
                  <img
                    src={VARIANTS.find((v) => v.id === currentColor).url}
                    alt={`AirPods Max - ${currentColor}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>
              <div className="price-info">
                <h3 className="text-3xl font-bold text-white">
                  {currentCurrency} {pricing[currentCurrency].toLocaleString()}
                </h3>
                <p className="text-gray-400">Free delivery and free returns</p>
              </div>
            </div>
          </motion.div>

          <div className="currency-selector flex justify-center space-x-4">
            {Object.keys(pricing).map((currency) => (
              <button
                key={currency}
                className={`currency-button ${
                  currentCurrency === currency ? "active" : ""
                }`}
                onClick={() => handleCurrencyChange(currency)}
              >
                {currency}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
