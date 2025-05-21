import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AirpodsModel from "./components/AirpodsModel";
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
  const colors = ["space-gray", "silver", "green", "sky-blue", "pink"];

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

      // Create horizontal scroll animation
      ScrollTrigger.create({
        trigger: horizontalSection,
        start: "top 20%",
        end: () => `+=${horizontalSection.offsetWidth}`,
        pin: true,
        onEnter: () => setHorizontalScrollActive(true),
        onLeaveBack: () => setHorizontalScrollActive(false),
        scrub: true,
      });

      // Create color change animation
      gsap.to(colorSections, {
        xPercent: -100 * (colorSections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalSection,
          start: "top 20%",
          end: () => `+=${horizontalSection.offsetWidth}`,
          scrub: true,
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
  }, []);

  // Handle navigation
  const handleNavigation = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black bg-opacity-80 backdrop-blur-md">
        <div className="flex items-center space-x-8">
          <button
            className={`nav-button ${activeSection === "home" ? "active" : ""}`}
            onClick={() => handleNavigation("home")}
          >
            Home
          </button>
          <button
            className={`nav-button ${
              activeSection === "features" ? "active" : ""
            }`}
            onClick={() => handleNavigation("features")}
          >
            Features
          </button>
          <button
            className={`nav-button ${
              activeSection === "colors" ? "active" : ""
            }`}
            onClick={() => handleNavigation("colors")}
          >
            Colors
          </button>
          <button
            className={`nav-button ${
              activeSection === "pricing" ? "active" : ""
            }`}
            onClick={() => handleNavigation("pricing")}
          >
            Pricing
          </button>
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
            scale,
            rotate: rotation,
            x: xPosition,
            width: "500px",
            height: "500px",
            filter: "drop-shadow(0 0 30px rgba(0, 113, 227, 0.3))",
          }}
        >
          {/* Fallback for when 3D model is loading */}
          <div className={`airpods-placeholder bg-${currentColor}`}></div>
          {/* 3D Model integration */}
          <ErrorBoundary fallbackColor={currentColor}>
            <AirpodsModel
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
            >
              <div className={`airpods-feature-image bg-${currentColor}`}></div>
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
        <div className="colors-container flex">
          {colors.map((color, index) => (
            <div
              key={color}
              className="color-section min-w-full min-h-screen flex items-center justify-center"
            >
              <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                <motion.div
                  className={`airpods-color-display bg-${color} ${
                    index % 2 === 0
                      ? "order-1 md:order-1"
                      : "order-1 md:order-2"
                  }`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                ></motion.div>
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
                    {color.replace("-", " ")}
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
            {colors.map((color) => (
              <motion.div
                key={color}
                className={`color-option cursor-pointer ${
                  currentColor === color ? "selected" : ""
                }`}
                onClick={() => setCurrentColor(color)}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className={`color-circle bg-${color}`}></div>
                <p className="text-white mt-2 capitalize">
                  {color.replace("-", " ")}
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
              <div className="small-airpods-icon mr-4">
                <div className={`mini-airpods bg-${currentColor}`}></div>
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
