import { motion } from "framer-motion";

import { VARIANTS_DATA as VARIANTS } from "../data/variants";

// Component now uses centralized variants data

const AirpodsVariant = ({
  color = "space-gray",
  scale = 1,
  rotation = 0,
  xPosition = 0,
}) => {
  // Find the variant that matches the color prop
  const variant =
    VARIANTS.find((v) => v.id === color) ||
    VARIANTS.find((v) => v.id === "space-gray");

  return (
    <motion.img
      src={variant.url}
      alt={`AirPods Max - ${variant.name}`}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        filter: `drop-shadow(0 0 30px ${variant.glow})`,
      }}
      animate={{
        scale: scale,
        rotate: rotation,
        x: xPosition,
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
      }}
    />
  );
};

// Export the component as default only
export default AirpodsVariant;
