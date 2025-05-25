// Import images with proper paths
import silverImg from "../assets/AirPods Max Silver.png";
import pinkImg from "../assets/AirPods Max Pink.png";
import spaceGrayImg from "../assets/AirPods Max Space Gray.png";
import skyBlueImg from "../assets/AirPods Max Sky Blue.png";
import greenImg from "../assets/AirPods Max Green.png";

// Define variants data
export const VARIANTS_DATA = [
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
