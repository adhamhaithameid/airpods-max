import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const AirpodsModel = ({ color, scale, rotation, xPosition }) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Map color names to their corresponding model IDs or use a default
  // These are placeholder IDs - in a real app, you'd have different model IDs for each color
  const colorToModelMap = {
    "space-gray": "335a088f07dd45019f8317b6dadf6023",
    silver: "335a088f07dd45019f8317b6dadf6023",
    green: "335a088f07dd45019f8317b6dadf6023",
    "sky-blue": "335a088f07dd45019f8317b6dadf6023",
    pink: "335a088f07dd45019f8317b6dadf6023",
  };

  const modelId = colorToModelMap[color] || "335a088f07dd45019f8317b6dadf6023";

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Apply color filter based on selected color when using the same base model
  useEffect(() => {
    if (iframeRef.current && !isLoading) {
      // This is a workaround to simulate color changes when using the same model
      // In a production app, you would use different model IDs for each color
      const iframe = iframeRef.current;
      iframe.style.filter = getColorFilter(color);
    }
  }, [color, isLoading]);
  
  // Update transform values when they change
  useEffect(() => {
    const updateTransform = () => {
      if (iframeRef.current) {
        const scaleValue = typeof scale === 'object' ? scale.get() : 1;
        const rotateValue = typeof rotation === 'object' ? rotation.get() : 0;
        const translateValue = typeof xPosition === 'object' ? xPosition.get() : 0;
        
        iframeRef.current.style.transform = `scale(${scaleValue}) rotate(${rotateValue}deg) translateX(${translateValue})`;
      }
    };
    
    // Initial update
    updateTransform();
    
    // Set up listeners for motion values if they're objects
    if (typeof scale === 'object') {
      scale.onChange(updateTransform);
    }
    if (typeof rotation === 'object') {
      rotation.onChange(updateTransform);
    }
    if (typeof xPosition === 'object') {
      xPosition.onChange(updateTransform);
    }
    
    return () => {
      // Clean up listeners
      if (typeof scale === 'object') scale.clearListeners();
      if (typeof rotation === 'object') rotation.clearListeners();
      if (typeof xPosition === 'object') xPosition.clearListeners();
    };
  }, [scale, rotation, xPosition]);

  // Helper function to generate CSS filters based on color
  const getColorFilter = (colorName) => {
    switch (colorName) {
      case "silver":
        return "brightness(1.3) saturate(0.2)";
      case "green":
        return "hue-rotate(100deg) saturate(0.8) brightness(0.8)";
      case "sky-blue":
        return "hue-rotate(180deg) saturate(0.7) brightness(1.1)";
      case "pink":
        return "hue-rotate(320deg) saturate(0.8) brightness(1.1)";
      default: // space-gray
        return "brightness(1) saturate(1)";
    }
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
          position: "relative",
          zIndex: 1
        }}
      >
        <iframe 
          ref={iframeRef}
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
          src={`https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0`}
          onLoad={handleIframeLoad}
          style={{ 
            width: "100%", 
            height: "100%",
            transition: "transform 0.3s ease"
          }}
        ></iframe>
      </motion.div>

      <div className="model-attribution">
        <p style={{ fontSize: "10px", fontWeight: "normal", margin: "2px", color: "#ffffff" }}>
          <a href={`https://sketchfab.com/3d-models/airpods-max-new-color-midnight-2024-${modelId}`} 
             target="_blank" 
             rel="nofollow" 
             style={{ fontWeight: "bold", color: "#1CAAD9" }}>
            AirPods Max
          </a> by 
          <a href="https://sketchfab.com/ikad2023" 
             target="_blank" 
             rel="nofollow" 
             style={{ fontWeight: "bold", color: "#1CAAD9" }}>
            dika3d
          </a>
        </p>
      </div>
    </div>
  );
};

export default AirpodsModel;
