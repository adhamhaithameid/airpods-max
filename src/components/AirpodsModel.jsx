import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const AirpodsModel = ({ color, scale, rotation, xPosition }) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Map color names to their corresponding model IDs
  // Using the midnight model ID from the provided embed
  const modelId = "335a088f07dd45019f8317b6dadf6023";
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="model-container" ref={containerRef}>
      {isLoading && (
        <div className={`loading-placeholder bg-${color}`}>
          <div className="loading-spinner"></div>
        </div>
      )}
      
      <motion.div 
        className="sketchfab-embed-wrapper" 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${typeof scale === 'object' ? scale.get() : 1}) 
                     rotate(${typeof rotation === 'object' ? rotation.get() : 0}deg) 
                     translateX(${typeof xPosition === 'object' ? xPosition.get() : 0})`
        }}
      >
        <iframe 
          title="AirPods Max 3D Model"
          frameBorder="0" 
          allowFullScreen 
          mozallowfullscreen="true" 
          webkitallowfullscreen="true" 
          allow="autoplay; fullscreen; xr-spatial-tracking" 
          xr-spatial-tracking 
          execution-while-out-of-viewport 
          execution-while-not-rendered 
          web-share 
          src={`https://sketchfab.com/models/${modelId}/embed`}
          onLoad={handleIframeLoad}
          style={{ width: "100%", height: "100%" }}
        ></iframe>
      </motion.div>
      
      <div className="model-attribution">
        <p style={{ fontSize: "13px", fontWeight: "normal", margin: "5px", color: "#4A4A4A" }}>
          <a href={`https://sketchfab.com/3d-models/airpods-max-new-color-midnight-2024-${modelId}?utm_medium=embed&utm_campaign=share-popup&utm_content=${modelId}`} 
             target="_blank" 
             rel="nofollow" 
             style={{ fontWeight: "bold", color: "#1CAAD9" }}>
            AirPods Max New Color Midnight 2024
          </a> by 
          <a href="https://sketchfab.com/ikad2023?utm_medium=embed&utm_campaign=share-popup&utm_content=${modelId}" 
             target="_blank" 
             rel="nofollow" 
             style={{ fontWeight: "bold", color: "#1CAAD9" }}>
            dika3d
          </a> on 
          <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=${modelId}" 
             target="_blank" 
             rel="nofollow" 
             style={{ fontWeight: "bold", color: "#1CAAD9" }}>
            Sketchfab
          </a>
        </p>
      </div>
    </div>
  );
};

export default AirpodsModel;
