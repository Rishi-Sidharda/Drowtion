"use client";
import { useEffect, useRef } from "react";
import { Icon } from "lucide-react"; // Import the general type for clarity

// Props now accept an Icon component instead of a string src
export default function FloatingIcon({
  IconComponent,
  size = 100,
  speed = 0.5,
}) {
  const divRef = useRef(null); // Changed to a div ref to wrap the icon

  useEffect(() => {
    // Initial position and velocity logic remains the same
    let posX = Math.random() * window.innerWidth;
    let posY = Math.random() * window.innerHeight;

    let velX = (Math.random() * 2 - 1) * speed;
    let velY = (Math.random() * 2 - 1) * speed;

    const move = () => {
      posX += velX;
      posY += velY; // Wrap-around edges logic remains the same

      if (posX > window.innerWidth) posX = -size;
      if (posX < -size) posX = window.innerWidth;
      if (posY > window.innerHeight) posY = -size;
      if (posY < -size) posY = window.innerHeight;

      if (divRef.current) {
        divRef.current.style.transform = `translate(${posX}px, ${posY}px)`;
      }

      requestAnimationFrame(move);
    };

    move();
  }, [size, speed]);

  return (
    <div // Use a <div> as the container for animation
      ref={divRef}
      className="fixed pointer-events-none opacity-20 blur-xs"
      style={{
        width: size,
        height: size,
        zIndex: 0, // Add transition for smooth initial placement, though not strictly needed for RAF
      }}>
           {" "}
      {IconComponent && (
        <IconComponent
          size={size} // Pass the size to the Lucide icon
          strokeWidth={1} // Optional: Adjust stroke for visual style
          className="w-full h-full" // Ensure icon fills the container
        />
      )}
         {" "}
    </div>
  );
}
