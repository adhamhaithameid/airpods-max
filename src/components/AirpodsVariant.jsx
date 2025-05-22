import { motion } from "framer-motion";

const VARIANTS = [
  {
    name: "Silver",
    // Single AirPod version (hero section)
    singleUrl:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-hero-select-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604709293000",
    // Double AirPods version (other sections)
    url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-silver-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604021221000",
    glow: "rgba(255,255,255,.6)",
    hex: "#C0C0C0",
    id: "silver",
  },
  {
    name: "Pink",
    singleUrl:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-hero-select-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604709293000",
    url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-pink-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604022365000",
    glow: "rgba(255,200,210,.3)",
    hex: "#F7C0CB",
    id: "pink",
  },
  {
    name: "Space Gray",
    singleUrl:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-hero-select-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604709293000",
    url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-spacegray-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604709508000",
    glow: "rgba(100,100,100,.3)",
    hex: "#6E6E6E",
    id: "space-gray",
  },
  {
    name: "Sky Blue",
    singleUrl:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-hero-select-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604709293000",
    url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-skyblue-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604022365000",
    glow: "rgba(173,216,230,.3)",
    hex: "#ADD8E6",
    id: "sky-blue",
  },
  {
    name: "Green",
    singleUrl:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-hero-select-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604709293000",
    url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-green-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604022365000",
    glow: "rgba(144,238,144,.3)",
    hex: "#90EE90",
    id: "green",
  },
];

const AirpodsVariant = ({
  color,
  scale,
  rotation,
  xPosition,
  useSingleVersion = false,
}) => {
  // Find the current variant based on color ID
  const currentVariant =
    VARIANTS.find((variant) => variant.id === color) || VARIANTS[2]; // Default to Space Gray

  // Choose the appropriate URL based on the useSingleVersion prop
  const imageUrl = useSingleVersion
    ? currentVariant.singleUrl
    : currentVariant.url;

  return (
    <div className="airpods-variant-container" style={{ position: "relative" }}>
      <motion.img
        src={imageUrl}
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
