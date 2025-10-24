"use client";

import dynamic from "next/dynamic";
import React, { useRef, useEffect, useState } from "react";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

export default function FixedRectBoard() {
  const excalidrawRef = useRef(null);
  const [api, setApi] = useState(null);

  // ✅ Wait for the Excalidraw API to be ready
  useEffect(() => {
    if (!excalidrawRef.current) return;
    excalidrawRef.current.readyPromise.then((api) => {
      setApi(api);
    });
  }, []);

  const addFixedRectangle = () => {
    if (!api) return console.warn("Excalidraw API not ready yet");

    const id = `rect-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const newRect = {
      type: "rectangle",
      id,
      x: 100,
      y: 100,
      width: 200,
      height: 120,
      angle: 0,
      strokeColor: "#1e90ff",
      backgroundColor: "#d0e7ff",
      fillStyle: "solid",
      strokeWidth: 2,
      roughness: 1,
      opacity: 100,
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      seed: Math.floor(Math.random() * 100000),
      groupIds: [],
      roundness: { type: 2 },
    };

    const elements = api.getSceneElements();
    api.updateScene({ elements: [...elements, newRect] });

    console.log("Added rectangle with ID:", id);
  };

  return (
    <div style={{ height: "100vh" }}>
      <Excalidraw ref={excalidrawRef} />
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <button
          onClick={addFixedRectangle}
          style={{
            background: "#1e90ff",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Add Rectangle
        </button>
      </div>
    </div>
  );
}
