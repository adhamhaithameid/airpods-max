import { motion } from "framer-motion";

const VARIANTS = [
  {
    name: "Silver",
    url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-hero-select-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604709293000",
    glow: "rgba(255,255,255,.6)",
    id: "silver",
  },
  {
    name: "Pink",
    url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-pink-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604022365000",
    glow: "rgba(255,200,210,.3)",
    id: "pink",
  },
  {
    name: "Space Gray",
    url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-spacegray-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604709508000",
    glow: "rgba(100,100,100,.3)",
    id: "space-gray",
  },
  {
    name: "Sky Blue",
    url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-skyblue-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604022365000",
    glow: "rgba(173,216,230,.3)",
    id: "sky-blue",
  },
  {
    name: "Green",
    url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-green-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604022365000",
    glow: "rgba(144,238,144,.3)",
    id: "green",
  },
];

const AirpodsVariant = ({ color, scale, rotation, xPosition }) => {
  // Find the current variant based on color ID
  const currentVariant =
    VARIANTS.find((variant) => variant.id === color) || VARIANTS[2]; // Default to Space Gray

  return (
    <div className="airpods-variant-container" style={{ position: "relative" }}>
      <motion.img
        src={currentVariant.url}
        alt={`AirPods Max - ${currentVariant.name}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: `drop-shadow(0 0 30px ${currentVariant.glow})`,
          scale: typeof scale === "object" ? scale : undefined,
          rotate: typeof rotation === "object" ? rotation : undefined,
          x: typeof xPosition === "object" ? xPosition : undefined,
        }}
        animate={{
          scale: typeof scale === "object" ? undefined : scale,
          rotate: typeof rotation === "object" ? undefined : rotation,
          x: typeof xPosition === "object" ? undefined : xPosition,
          filter: `drop-shadow(0 0 30px ${currentVariant.glow})`,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          filter: { duration: 0.8, ease: "linear" },
        }}
        initial={false}
        layout
      />
    </div>
  );
};

export { VARIANTS };
export default AirpodsVariant;
