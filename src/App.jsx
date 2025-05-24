import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AirpodsVariant, {
  VARIANTS_DATA as VARIANTS,
} from "./components/AirpodsVariant";
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

  // Initialize animations - only on page load, not on color change
  useEffect(() => {
    // Initial glow animation with enhanced effects - only on page load
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

    // Set initial color to space-gray and don't change it automatically
    setCurrentColor("space-gray");
  }, []); // Empty dependency array ensures this only runs once on mount

  // Setup horizontal scroll for colors section
  useEffect(() => {
    // Target the colors section specifically
    const colorsSection = document.querySelector("#colors");

    if (colorsSection) {
      const colorSections = gsap.utils.toArray(".color-section");
      const colorsContainer = colorsSection.querySelector(".colors-container");

      if (!colorsContainer || colorSections.length === 0) return;

      // Clear any existing ScrollTriggers for colors section to prevent conflicts
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === colorsSection) {
          st.kill();
        }
      });

      // Calculate total scroll distance
      const totalDistance = (colorSections.length - 1) * 100;

      // Set up the colors container for horizontal scrolling
      gsap.set(colorsContainer, {
        width: `${colorSections.length * 100}vw`,
        display: "flex",
        flexDirection: "row",
      });

      // Ensure each color section has the correct width
      colorSections.forEach((section) => {
        gsap.set(section, {
          width: "100vw",
          flex: "0 0 100vw",
        });
      });

      // Main ScrollTrigger for pinning the colors section
      ScrollTrigger.create({
        trigger: colorsSection,
        start: "top top",
        end: () => `+=${totalDistance}vh`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 1,
        invalidateOnRefresh: true,
        markers: false,
      });

      // Create horizontal scroll animation for colors
      gsap.to(colorsContainer, {
        x: () => -(colorsContainer.offsetWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: colorsSection,
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
            // Update color based on scroll progress
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
  }, [colors]);

  // Create scroll progress indicator with improved implementation
  useEffect(() => {
    const progressBar = document.querySelector(".scroll-progress-bar");
    if (progressBar) {
      // Clear any existing ScrollTriggers for the progress bar
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === document.body) {
          st.kill();
        }
      });

      // Create new ScrollTrigger for progress bar
      gsap.fromTo(
        progressBar,
        { width: "0%" },
        {
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        }
      );
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Setup horizontal scroll for videos section
  useEffect(() => {
    // Horizontal scroll section for videos
    const videosSection =
      document.querySelector(".videos-container")?.parentElement;

    if (videosSection) {
      const videoSections = gsap.utils.toArray(".video-section");

      // Set the width of the videos container to accommodate all sections
      const videosContainer = videosSection.querySelector(".videos-container");
      if (!videosContainer) return;

      // Clear any existing ScrollTriggers to prevent conflicts
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === videosSection) {
          st.kill();
        }
      });

      // Create horizontal scroll animation with improved configuration
      // Increase total distance to accommodate the additional video
      const totalDistance = videoSections.length * 100;

      // Set up the videos container for horizontal scrolling
      gsap.set(videosContainer, {
        width: `${videoSections.length * 100}vw`,
        display: "flex",
        flexDirection: "reverse-row",
        position: "relative", // Add position relative to fix scroll calculation
      });

      // Ensure each video section has the correct width
      videoSections.forEach((section) => {
        gsap.set(section, {
          width: "100vw",
          flex: "0 0 100vw",
          position: "relative", // Add position relative to fix scroll calculation
        });
      });

      // Main ScrollTrigger for pinning the section
      ScrollTrigger.create({
        trigger: videosSection,
        start: "top top",
        end: () => `+=${totalDistance}vh`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1, // Helps with smoother pinning
        scrub: 1, // Smoother scrubbing with a small delay
        invalidateOnRefresh: true, // Recalculate on window resize
        markers: false, // Set to true for debugging
      });

      // Create scroll animation for videos container
      gsap.to(videosContainer, {
        x: () => -(videosContainer.offsetWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: videosSection,
          start: "top top",
          end: () => `+=${totalDistance}vw`,
          scrub: 1,
          snap: {
            snapTo: 1 / (videoSections.length - 1),
            duration: 0.3,
            ease: "power1.inOut",
          },
          invalidateOnRefresh: true,
        },
      });
    }
  }, []); // Empty dependency array ensures this only runs once on mount

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

        <div className="flex justify-between items-center p-4 self-center">
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
          background:
            "radial-gradient(circle at 50% 30%, #1f1f1f 0%, #111 60%)",
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
          <ErrorBoundary fallbackColor="space-gray">
            <AirpodsVariant
              color="space-gray"
              scale={scale}
              // rotation={rotation}
              // xPosition={xPosition}
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
              {VARIANTS.find((v) => v.id === "silver") && (
                <div
                  className="airpods-feature-image"
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "400px",
                    position: "relative",
                    filter: `drop-shadow(0 0 30px ${
                      VARIANTS.find((v) => v.id === "silver").glow
                    })`,
                  }}
                >
                  <img
                    src={VARIANTS.find((v) => v.id === "silver").url}
                    alt={`AirPods Max - silver`}
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

      {/* Videos Section with Horizontal Scrolling */}
      <section
        id="videos"
        className="horizontal-scroll min-h-screen relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(255,255,255,.05) 0%, transparent 70%)",
        }}
      >
        <motion.h2
          className="text-4xl font-bold mb-8 text-white absolute left-0 right-0 text-center z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          What People Are Saying
        </motion.h2>

        <div
          className="videos-container"
          style={{ display: "flex", height: "100vh" }}
        >
          {/* Apple Official Video */}
          <div
            className="video-section min-h-screen flex items-center justify-center"
            style={{ minWidth: "100vw" }}
          >
            <div className="container mx-auto px-4 text-center">
              <motion.h3
                className="text-3xl font-bold mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Official Apple Video
              </motion.h3>
              <motion.div
                className="video-container relative overflow-hidden rounded-2xl shadow-2xl mx-auto"
                style={{ maxWidth: "1000px", aspectRatio: "16/9" }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/WDjE6nPLOUo"
                  title="AirPods Max - Introducing (official commercial video)"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </motion.div>
            </div>
          </div>

          {/* MKBHD Video */}
          <div
            className="video-section min-h-screen flex items-center justify-center"
            style={{ minWidth: "100vw" }}
          >
            <div className="container mx-auto px-4 text-center">
              <motion.h3
                className="text-3xl font-bold mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                MKBHD Review
              </motion.h3>
              <motion.div
                className="video-container relative overflow-hidden rounded-2xl shadow-2xl mx-auto"
                style={{ maxWidth: "1000px", aspectRatio: "16/9" }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/UdfSrJvqY_E"
                  title="AirPods Max Unboxing &amp; Impressions: $550?!"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </motion.div>
            </div>
          </div>

          {/* Yahia Radwan Video */}
          <div
            className="video-section min-h-screen flex items-center justify-center"
            style={{ minWidth: "100vw" }}
          >
            <div className="container mx-auto px-4 text-center">
              <motion.h3
                className="text-3xl font-bold mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Yahia Radwan Review
              </motion.h3>
              <motion.div
                className="video-container relative overflow-hidden rounded-2xl shadow-2xl mx-auto"
                style={{ maxWidth: "1000px", aspectRatio: "16/9" }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/q_zWsElrZNc"
                  title="كيف غيرت آبل الموسيقى للأبد ؟! 😮"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ░░░ COLORS ░░░ (right → left horizontal scroll) */}
      <section
        id="colors"
        className="horizontal-scroll min-h-screen relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#161616 0%,#0f0f0f 70%)" }}
      >
        <motion.h2
          className="text-4xl font-bold mb-8 text-white absolute top-10 left-0 right-0 text-center z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Available Colors
        </motion.h2>

        <div
          className="colors-container"
          style={{ display: "flex", height: "100vh" }}
        >
          {/* ───── Space Gray ───── */}
          {(() => {
            const v = VARIANTS.find((x) => x.id === "space-gray");
            return (
              <div
                className="color-section min-h-screen flex items-center justify-center"
                style={{ minWidth: "100vw" }}
              >
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                  <motion.div
                    className="airpods-color-display order-1 md:order-1"
                    style={{
                      width: 500,
                      height: 500,
                      filter: `drop-shadow(0 0 30px ${v.glow})`,
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <img
                      src={v.url}
                      alt="AirPods Max – Space Gray"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="text-content order-2 md:order-2 text-left md:w-1/2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-4xl font-bold mb-6 text-white">
                      Space Gray
                    </h2>
                    <p className="text-gray-300 text-lg">
                      A sleek dark finish that pairs perfectly with everything.
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })()}

          {/* ───── Silver ───── */}
          {(() => {
            const v = VARIANTS.find((x) => x.id === "silver");
            return (
              <div
                className="color-section min-h-screen flex items-center justify-center"
                style={{ minWidth: "100vw" }}
              >
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                  <motion.div
                    className="airpods-color-display order-1 md:order-2"
                    style={{
                      width: 500,
                      height: 500,
                      filter: `drop-shadow(0 0 30px ${v.glow})`,
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <img
                      src={v.url}
                      alt="AirPods Max – Silver"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="text-content order-2 md:order-1 text-left md:w-1/2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-4xl font-bold mb-6 text-white">
                      Silver
                    </h2>
                    <p className="text-gray-300 text-lg">
                      Understated, modern, and ready for any environment.
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })()}

          {/* ───── Green ───── */}
          {(() => {
            const v = VARIANTS.find((x) => x.id === "green");
            return (
              <div
                className="color-section min-h-screen flex items-center justify-center"
                style={{ minWidth: "100vw" }}
              >
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                  <motion.div
                    className="airpods-color-display order-1 md:order-1"
                    style={{
                      width: 500,
                      height: 500,
                      filter: `drop-shadow(0 0 30px ${v.glow})`,
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <img
                      src={v.url}
                      alt="AirPods Max – Green"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="text-content order-2 md:order-2 text-left md:w-1/2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-4xl font-bold mb-6 text-white">
                      Green
                    </h2>
                    <p className="text-gray-300 text-lg">
                      Fresh and vibrant—add a pop of color to your sound.
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })()}

          {/* ───── Pink ───── */}
          {(() => {
            const v = VARIANTS.find((x) => x.id === "pink");
            return (
              <div
                className="color-section min-h-screen flex items-center justify-center"
                style={{ minWidth: "100vw" }}
              >
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                  <motion.div
                    className="airpods-color-display order-1 md:order-2"
                    style={{
                      width: 500,
                      height: 500,
                      filter: `drop-shadow(0 0 30px ${v.glow})`,
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <img
                      src={v.url}
                      alt="AirPods Max – Pink"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="text-content order-2 md:order-1 text-left md:w-1/2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-4xl font-bold mb-6 text-white">Pink</h2>
                    <p className="text-gray-300 text-lg">
                      Bold and playful—make a statement every time you listen.
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })()}

          {/* ───── Sky Blue ───── */}
          {(() => {
            const v = VARIANTS.find((x) => x.id === "sky-blue");
            return (
              <div
                className="color-section min-h-screen flex items-center justify-center"
                style={{ minWidth: "100vw" }}
              >
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                  <motion.div
                    className="airpods-color-display order-1 md:order-1"
                    style={{
                      width: 500,
                      height: 500,
                      filter: `drop-shadow(0 0 30px ${v.glow})`,
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <img
                      src={v.url}
                      alt="AirPods Max – Sky Blue"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="text-content order-2 md:order-2 text-left md:w-1/2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-4xl font-bold mb-6 text-white">
                      Sky Blue
                    </h2>
                    <p className="text-gray-300 text-lg">
                      Cool and calming—like a clear day’s soundtrack.
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="pricing-section min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#141414] to-black"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Choose Your Style
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 -mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            AirPods Max are available in five stunning colors. Pick your
            favorite and experience the magic.
          </motion.p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            {/* Color Preview */}
            <motion.div
              className="color-preview relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <AirpodsVariant color={currentColor} scale={1} />
            </motion.div>

            {/* Pricing Details */}
            <motion.div
              className="pricing-details text-left"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-white mb-4">
                {VARIANTS.find((v) => v.id === currentColor).name}
              </h3>

              {/* Color Selector Circles */}
              <div className="color-selector flex gap-4 mb-6">
                {VARIANTS.map((variant) => (
                  <button
                    key={variant.id}
                    className={`color-circle ${
                      currentColor === variant.id
                        ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                        : ""
                    }`}
                    style={{ backgroundColor: variant.hex }}
                    onClick={() => setCurrentColor(variant.id)}
                    aria-label={`Select ${variant.name} color`}
                  />
                ))}
              </div>

              <div className="price text-5xl font-bold text-white mb-6">
                {currentCurrency} {pricing[currentCurrency].toLocaleString()}
              </div>

              {/* Currency Selector */}
              <div className="currency-selector flex gap-2 mb-8">
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

              <p className="text-gray-300 mb-8">
                Available for pickup at an Apple Store near you.
                <br />
                Free delivery and free returns.
              </p>

              <div className="flex justify-between items-center">
                <button
                  className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-glow"
                  style={{
                    boxShadow: `0 0 15px 5px rgba(255, 255, 255, 0.3), 0 0 30px 10px rgba(${
                      VARIANTS.find((v) => v.id === currentColor).glow
                    }, 0.2)`,
                  }}
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black text-white">
        <div className="mb-1 md:mb-0">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Apple Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
