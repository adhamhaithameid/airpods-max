import { motion } from "framer-motion";

import silverImg from "../assets/AirPods Max Silver.png";
import pinkImg from "../assets/AirPods Max Pink.png";
import spaceGrayImg from "../assets/AirPods Max Space Gray.png";
import skyBlueImg from "../assets/AirPods Max Sky Blue.png";
import greenImg from "../assets/AirPods Max Green.png";

const VARIANTS = [
  {
    name: "Silver",
    url: silverImg,
    glow: "rgba(255,255,255,.3)",
    hex: "#C0C0C0",
    id: "silver",
  },
  {
    name: "Pink",
    url: pinkImg,
    glow: "rgba(255,200,210,.3)",
    hex: "#F7C0CB",
    id: "pink",
  },
  {
    name: "Space Gray",
    url: spaceGrayImg,
    glow: "rgba(100,100,100,.3)",
    hex: "#6E6E6E",
    id: "space-gray",
  },
  {
    name: "Sky Blue",
    url: skyBlueImg,
    glow: "rgba(173,216,230,.3)",
    hex: "#ADD8E6",
    id: "sky-blue",
  },
  {
    name: "Green",
    url: greenImg,
    glow: "rgba(144,238,144,.3)",
    hex: "#90EE90",
    id: "green",
  },
];

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

// Export the component as default
export default AirpodsVariant;

// Export VARIANTS as a named constant
export const VARIANTS_DATA = VARIANTS;
