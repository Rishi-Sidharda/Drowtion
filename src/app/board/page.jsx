"use client";

import dynamic from "next/dynamic";
import React, { useState, useCallback, useEffect } from "react";
import "@excalidraw/excalidraw/index.css";
import { generateElements } from "./generateElements";

// ✅ Import the utility function for element creation

// Dynamically import Excalidraw (no SSR)
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading board...
      </div>
    ),
  }
);

export default function Board() {
  // 1. State to hold the Excalidraw API instance
  const [api, setApi] = useState(null);

  // 🟦 Draw a rectangle using the correct API method
  const handleCommandPallet = useCallback(async () => {
    if (!api) return;

    const { convertToExcalidrawElements } = await import(
      "@excalidraw/excalidraw"
    );

    // Convert the simplified structure into full Excalidraw elements
    const newElements = convertToExcalidrawElements(generateElements());

    api.updateScene({
      elements: [...api.getSceneElements(), ...newElements],
    });
  }, [api]); // Recreate callback when 'api' changes

  useEffect(() => {
    // Only attach listener once Excalidraw API is available
    if (!api) return;

    const handleKeyDown = (event) => {
      // Check for Ctrl (Windows/Linux) or Meta (Cmd on Mac) + /
      const isControlKey = event.ctrlKey || event.metaKey;
      const isForwardSlash = event.key === "/";

      if (isControlKey && isForwardSlash) {
        event.preventDefault(); // Stop default browser behavior (e.g., search)

        // ✅ Call your central action function
        handleCommandPallet();
      }
    };

    // Attach the global event listener
    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts or dependencies change
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [api, handleCommandPallet]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Sidebar (3% width) */}
      <div
        style={{
          width: "2%",
          backgroundColor: "#1e1e1e", // optional, just to visualize
          height: "100%",
        }}
      ></div>

      {/* Right Side - Excalidraw Canvas (97% width) */}
      <div style={{ position: "relative", width: "98%", height: "100vh" }}>
        {/* Excalidraw canvas */}
        <Excalidraw
          theme="dark"
          renderTopRightUI={() => {
            return (
              <button
                onClick={handleCommandPallet}
                className="text-xs"
                style={{
                  top: "16px",
                  right: "16px",
                  zIndex: 10,
                  background: "#232329",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 10px",
                  cursor: "pointer",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
              >
                Add Component
              </button>
            );
          }}
          excalidrawAPI={(excalidrawApi) => setApi(excalidrawApi)}
        />
      </div>
    </div>
  );
}
