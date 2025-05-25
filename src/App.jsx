import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import imagesLoaded from "imagesloaded";
import AirpodsVariant from "./components/AirpodsVariant";
import { VARIANTS_DATA as VARIANTS } from "./data/variants";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import LazyYouTube from "./components/LazyYouTube";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef(null);
  const airpodsRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("silver");
  const [currentCurrency, setCurrency] = useState("USD");
  const [activeSection, setActiveSection] = useState("home");
  const [manualColorSelection, setManualColorSelection] = useState(false);
  const manualColorTimeoutRef = useRef(null);
  const currentColorRef = useRef(currentColor);

  // Keep ref in‑sync with state so ScrollTrigger callbacks read latest value
  useEffect(() => {
    currentColorRef.current = currentColor;
  }, [currentColor]);

  const colors = VARIANTS.map((v) => v.id);
  const pricing = { USD: 549, EUR: 499, GBP: 449, JPY: 60000, CAD: 699 };

  /* ---------------------- core scroll progress ---------------------- */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end"],
  });
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [1, 0.8, 0.6, 0.4]
  );

  /* ---------------------- hero intro ---------------------- */
  useLayoutEffect(() => {
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
    setCurrentColor("space-gray");
  }, []);

  /* ---------------------- wait for images ---------------------- */
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // wait for every <img> in the page
    imagesLoaded(containerRef.current, () => {
      // ⬇ everything that builds ScrollTriggers MUST be inside here
      buildColourScroller(); // ← extract the code that sets them up
      buildVideoScroller(); // ← same for the videos
      ScrollTrigger.refresh(); // final sanity refresh
    });

    // helper definitions (pulled out of the old effects)
    function buildColourScroller() {
      /* …original code… */
    }
    function buildVideoScroller() {
      /* …original code… */
    }
  }, []);

  /* ========== COLOURS scroll — literal clone of Videos ========== */
  // useLayoutEffect(() => {
  //   const ctx = gsap.context(() => {
  //     /* track & slides */
  //     const section = document.getElementById("colors");
  //     if (!section) return;
  //     const container = section.querySelector(".colors-container");
  //     const slides = gsap.utils.toArray(".colors-container", container);
  //     if (!container || !slides.length) return;

  //     /* layout exactly like videos */
  //     gsap.set(container, {
  //       width: slides.length * 100 + "vw",
  //       display: "flex",
  //       position: "relative",
  //     });
  //     slides.forEach((s) =>
  //       gsap.set(s, { width: "100vw", flex: "0 0 100vw", position: "relative" })
  //     );

  //     /* one viewport per slide */
  //     const total = (slides.length - 1) * 100;

  //     /* pin whole section */
  //     ScrollTrigger.create({
  //       trigger: section,
  //       start: "top top",
  //       end: `+=${total}vh`,
  //       pin: true,
  //       scrub: 1,
  //     });

  //     /* horizontal move */
  //     gsap.to(container, {
  //       x: () => -(container.scrollWidth - innerWidth),
  //       ease: "none",
  //       scrollTrigger: {
  //         trigger: section,
  //         start: "top top",
  //         end: `+=${total}vw`,
  //         scrub: 1,
  //         snap: {
  //           snapTo: 1 / (slides.length - 1),
  //           duration: 0.3,
  //           ease: "power1.inOut",
  //         },
  //         onUpdate: (self) => {
  //           /* keep currentColor synced unless user picked manually */
  //           if (manualColorSelection) return;
  //           const i = Math.round(self.progress * (slides.length - 1));
  //           const id = slides[i].dataset.colorId;
  //           if (id && id !== currentColorRef.current) setCurrentColor(id);
  //         },
  //       },
  //     });
  //   }, containerRef);
  //   return () => ctx.revert();
  // }, []);

  /* ---------------------- videos horizontal scroll ---------------------- */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const videosSection =
        document.querySelector(".videos-container")?.parentElement;
      if (!videosSection) return;
      const videoSections = gsap.utils.toArray(".video-section");
      const videosContainer = videosSection.querySelector(".videos-container");
      if (!videosContainer) return;

      gsap.set(videosContainer, {
        width: `${videoSections.length * 100}vw`,
        display: "flex",
        position: "relative",
      });
      videoSections.forEach((s) =>
        gsap.set(s, { width: "100vw", flex: "0 0 100vw", position: "relative" })
      );
      const totalDistance = videoSections.length * 100;

      ScrollTrigger.create({
        trigger: videosSection,
        start: "top top",
        end: () => `+=${totalDistance}vh`,
        pin: true,
        scrub: 1,
      });
      gsap.to(videosContainer, {
        x: () => -(videosContainer.offsetWidth - innerWidth),
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
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  /* ---------------------- nav highlight ---------------------- */
  useEffect(() => {
    // const sections = ["home", "features", "colors", "videos", "pricing"];
    const sections = ["home", "features", "videos", "pricing"];
    const triggers = sections.map((id) => {
      const el = document.getElementById(id);
      return el
        ? ScrollTrigger.create({
            trigger: el,
            start: "top 40%",
            end: "bottom 40%",
            onEnter: () => setActiveSection(id),
            onEnterBack: () => setActiveSection(id),
          })
        : null;
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  /* ---------------------- handlers ---------------------- */
  const handleCurrencyChange = (c) => setCurrency(c);
  const handleManualColorChange = (id) => {
    if (manualColorTimeoutRef.current)
      clearTimeout(manualColorTimeoutRef.current);
    setManualColorSelection(true);
    setCurrentColor(id);
    manualColorTimeoutRef.current = setTimeout(
      () => setManualColorSelection(false),
      3000
    );
  };
  const handleNavigation = (section) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: "instant" });
  };

  return (
    <div
      className="app-container"
      ref={containerRef}
      style={{ position: "relative" }}
    >
      {/* ───── NAVBAR ───── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex flex-col bg-black/80 backdrop-blur-md">
        <div className="scroll-progress-container h-1 w-full bg-gray-800">
          <div className="scroll-progress-bar h-full bg-white w-0" />
        </div>

        <div className="flex justify-center p-4">
          {[
            { id: "home", label: "Home" },
            { id: "features", label: "Features" },
            { id: "videos", label: "Reviews" },
            /*{
              { id: "colors", label: "Colors" }, 
            },*/
            { id: "pricing", label: "Pricing" },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavigation(id)}
              className={`relative mx-2 px-4 py-2 text-white transition ${
                activeSection === id
                  ? "font-semibold"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {label}
              {activeSection === id && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-white"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </nav>
      {/* ───── HERO ───── */}
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center items-center overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, #1f1f1f 0%, #111 60%)",
        }}
      >
        <motion.div
          ref={airpodsRef}
          style={{
            position: "relative",
            width: 500,
            height: 500,
            perspective: 1000,
          }}
        >
          <ErrorBoundary fallbackColor="space-gray">
            <AirpodsVariant color="space-gray" />
          </ErrorBoundary>
        </motion.div>

        <motion.h1
          className="mt-8 text-5xl font-bold text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          AirPods Max
        </motion.h1>

        <motion.p
          className="mt-4 max-w-md text-center text-xl text-gray-300"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Introducing a new sound experience. Computational audio. Adaptive EQ.
          Active Noise Cancellation. Transparency mode.
        </motion.p>
      </section>
      {/* ───── FEATURES ───── */}
      <section
        id="features"
        className="min-h-screen flex flex-col justify-center"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, #1f1f1f 0%, #111 60%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              className="md:w-1/2 mb-10 md:mb-0 flex justify-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src={VARIANTS.find((v) => v.id === "silver").url}
                alt="AirPods Max – Silver"
                className="max-h-[400px]"
                style={{
                  filter: `drop-shadow(0 0 30px ${
                    VARIANTS.find((v) => v.id === "silver").glow
                  })`,
                }}
              />
            </motion.div>

            <motion.div
              className="md:w-1/2 text-left"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-4xl font-bold text-white">
                Immersive Listening
              </h2>
              <p className="mb-4 text-lg text-gray-300">
                The custom-built driver delivers undistorted audio across the
                entire audible range.
              </p>
              <p className="mb-4 text-lg text-gray-300">
                Computational audio teams the Apple H1 chip with advanced
                software for breakthrough listening experiences.
              </p>
              <p className="text-lg text-gray-300">
                Adaptive EQ tailors sound to the bespoke fit and seal created by
                the ear cushions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* ───── REVIEWS ───── */}
      <section
        id="videos"
        className="relative min-h-screen overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, #1f1f1f 0%, #111 60%)",
        }}
      >
        <motion.h2
          className="absolute top-10 left-0 right-0 z-10 text-center text-4xl font-bold text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          What People Are Saying
        </motion.h2>

        <div className="videos-container flex h-[100vh]">
          {[
            { title: "Official Apple Video", src: "WDjE6nPLOUo" },
            { title: "MKBHD Review", src: "UdfSrJvqY_E" },
            { title: "Yahia Radwan Review", src: "q_zWsElrZNc" },
          ].map(({ title, src }) => (
            <div
              key={src}
              className="video-section flex min-h-screen w-full items-center justify-center"
            >
              <div className="container mx-auto px-4 text-center">
                <motion.h3
                  className="mb-4 text-3xl font-bold text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {title}
                </motion.h3>
                <motion.div
                  className="mx-auto relative overflow-hidden rounded-2xl shadow-2xl"
                  style={{ maxWidth: 1000, aspectRatio: "16/9" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {/* <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${src}`}
                    title={title}
                    loading="lazy"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  /> */}
                  <LazyYouTube id={src} title={title} />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* <section
        id="colors"
        className="relative h-screen overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, #1f1f1f 0%, #111 60%)",
        }}
      >
        <motion.h2
          className="absolute top-10 left-0 right-0 z-10 text-center text-4xl font-bold text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Available Colors
        </motion.h2>

<div className="colors-container flex h-screen">

          {VARIANTS.map((v) => (
            <div
              key={v.id}
              className="color-section flex h-screen w-screen items-center justify-center"
              data-color-id={v.id}
            >
              <div className="container mx-auto flex flex-col gap-8 px-4 md:flex-row items-center">
                <img
                  src={v.url}
                  alt={`AirPods Max – ${v.name}`}
                  className="h-[500px] w-[500px]"
                  style={{ filter: `drop-shadow(0 0 30px ${v.glow})` }}
                />
                <div className="md:w-1/2 text-left">
                  <h2 className="mb-6 text-4xl font-bold text-white">
                    {v.name}
                  </h2>
                  <p className="text-lg text-gray-300">
                    {v.description ??
                      "Premium anodised aluminium in a finish that matches your style."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}
      {/* ───── PRICING ───── */}
      <section
        id="pricing"
        className="min-h-screen flex flex-col items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, #1f1f1f 0%, #111 60%)",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="mb-4 text-4xl font-bold text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Choose Your Style
          </motion.h2>

          <motion.p
            className="-mb-12 mx-auto max-w-2xl text-xl text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            AirPods Max are available in five stunning colors. Pick your
            favorite and experience the magic.
          </motion.p>

          <div className="mt-24 flex flex-col items-center justify-center gap-16 md:flex-row">
            {/* preview */}
            <motion.div
              className="color-preview relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <AirpodsVariant color={currentColor} />
            </motion.div>

            {/* details */}
            <motion.div
              className="pricing-details text-left"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-4 text-3xl font-bold text-white">
                {VARIANTS.find((v) => v.id === currentColor).name}
              </h3>

              {/* color picker */}
              <div className="mb-6 flex gap-4">
                {VARIANTS.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    aria-label={`Select ${variant.name} color`}
                    className={`color-circle ${
                      currentColor === variant.id
                        ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                        : ""
                    }`}
                    style={{ backgroundColor: variant.hex }}
                    onClick={() => handleManualColorChange(variant.id)}
                  />
                ))}
              </div>

              <div className="mb-6 text-5xl font-bold text-white">
                {currentCurrency} {pricing[currentCurrency].toLocaleString()}
              </div>

              {/* currency picker */}
              <div className="mb-8 flex gap-2">
                {Object.keys(pricing).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`currency-button ${
                      currentCurrency === c ? "active" : ""
                    }`}
                    onClick={() => handleCurrencyChange(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <p className="mb-8 text-gray-300">
                Available for pickup at an Apple Store near you. <br />
                Free delivery and free returns.
              </p>

              <div>
                <a
                  href="https://www.apple.com/shop/buy-airpods/airpods-max"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-block rounded-full bg-white px-8 py-3 font-bold text-black shadow-glow transition duration-300 hover:scale-105 hover:bg-gray-100"
                  style={{
                    boxShadow: `0 0 15px 5px rgba(255,255,255,.3),
                              0 0 30px 10px rgba(${
                                VARIANTS.find((v) => v.id === currentColor).glow
                              },.2)`,
                  }}
                >
                  Buy Now
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* ───── FOOTER ───── */}
      <footer className="bg-black py-4 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Apple Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
