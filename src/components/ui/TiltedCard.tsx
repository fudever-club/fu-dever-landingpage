"use client";

/**
 * TiltedCard Component
 * 
 * A high-end interactive card with 3D parallax effects, physics-based motion,
 * and a follow-the-cursor tooltip (from Superdesign Library).
 */

import React, { useRef, useState, useEffect } from "react";
import type { SpringOptions } from "framer-motion";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { StaticImageData } from "next/image";

export interface TiltedCardProps {
  /** Source URL for the card image (string or StaticImageData) */
  imageSrc: string | StaticImageData;
  /** Alt text for the image */
  altText?: string;
  /** Text shown in the floating tooltip */
  captionText?: string;
  /** Height of the outer container */
  containerHeight?: React.CSSProperties["height"];
  /** Width of the outer container */
  containerWidth?: React.CSSProperties["width"];
  /** Height of the actual image */
  imageHeight?: React.CSSProperties["height"];
  /** Width of the actual image */
  imageWidth?: React.CSSProperties["width"];
  /** Scaling factor when hovered (e.g., 1.1) */
  scaleOnHover?: number;
  /** Maximum rotation degrees (higher = more intense tilt) */
  rotateAmplitude?: number;
  /** Whether to show a warning message on mobile devices */
  showMobileWarning?: boolean;
  /** Whether to show the cursor-following tooltip */
  showTooltip?: boolean;
  /** Custom content to overlay on top of the card with Z-depth */
  overlayContent?: React.ReactNode;
  /** Whether to display the overlay content */
  displayOverlayContent?: boolean;
  /** Custom class name for the figure element */
  className?: string;
  /** Custom class name for the inner image */
  imageClassName?: string;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export const TiltedCard = ({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "100%",
  containerWidth = "100%",
  imageHeight = "100%",
  imageWidth = "100%",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  className = "",
  imageClassName = "",
}: TiltedCardProps) => {
  const ref = useRef<HTMLElement>(null);

  const initialSrc =
    typeof imageSrc === "object" && imageSrc !== null && "src" in imageSrc
      ? imageSrc.src
      : (imageSrc as string);

  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);

  useEffect(() => {
    const nextSrc =
      typeof imageSrc === "object" && imageSrc !== null && "src" in imageSrc
        ? imageSrc.src
        : (imageSrc as string);
    setCurrentSrc(nextSrc || "/images/pages/leaderBoard/avatar_default.png");
  }, [imageSrc]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });
  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className={`relative [perspective:800px] flex flex-col items-center justify-center select-none ${className}`}
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-2 text-center text-[10px] block sm:hidden text-slate-400">
          Tối ưu trải nghiệm tốt nhất trên Desktop
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d] flex items-center justify-center w-full h-full"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        <motion.img
          src={currentSrc}
          alt={altText}
          onError={() => {
            setCurrentSrc("/images/pages/leaderBoard/avatar_default.png");
          }}
          className={`w-full h-full object-cover rounded-2xl shadow-xl will-change-transform [transform:translateZ(0)] ${imageClassName}`}
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />

        {displayOverlayContent && overlayContent && (
          <motion.div className="absolute inset-0 z-[2] w-full h-full flex flex-col justify-end will-change-transform [transform:translateZ(30px)] pointer-events-none">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && captionText && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 text-[11px] font-mono font-bold text-white shadow-2xl opacity-0 z-[10] hidden sm:block whitespace-nowrap"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
};

export default TiltedCard;
