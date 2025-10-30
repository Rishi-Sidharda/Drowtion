"use client";

import React, { useEffect, useRef } from "react";

export default function FloatingNotion({ title, children, onClose }) {
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // if click target is NOT inside the container, call onClose
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.25s ease-in-out",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "70%",
          height: "90%",
          backgroundColor: "#1e1e1e",
          borderRadius: "10px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          color: "white",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}
