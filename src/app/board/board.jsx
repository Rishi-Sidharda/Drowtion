"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "@excalidraw/excalidraw/index.css";
import { setExcalidrawApi } from "./boardApi";
import FloatingNotion from "./floatingNotion";
import CommandPallet from "./commandPallet";
import { Menu, Settings, UserRoundCog } from "lucide-react";
import {
  SquareChevronRight,
  LayoutDashboard,
  SquareChevronLeft,
} from "lucide-react";

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
        }}>
        Loading board...
      </div>
    ),
  }
);

export default function Board() {
  const searchParams = useSearchParams();
  const boardId = searchParams.get("id");

  const [api, setApi] = useState(null);
  const [showFloatingNotion, setShowFloatingNotion] = useState(false);
  const [showCommandPallet, setShowCommandPallet] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Register the Excalidraw API
  useEffect(() => {
    if (api) setExcalidrawApi(api);
  }, [api]);

  // ✅ Keyboard shortcut for Command Palette
  useEffect(() => {
    if (!api) return;
    const handleKeyDown = (event) => {
      const isControlKey = event.ctrlKey || event.metaKey;
      const isForwardSlash = event.key === "/";
      if (isControlKey && isForwardSlash) {
        event.preventDefault();
        setShowCommandPallet(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [api]);

  // ✅ Load board data from localStorage after API ready
  useEffect(() => {
    if (!api || !boardId || isLoaded) return;

    // Only load the specific board, not all boards
    const boardKey = `board_${boardId}`;
    const storedBoard = localStorage.getItem(boardKey);

    if (storedBoard) {
      const boardData = JSON.parse(storedBoard);

      const fixedAppState = {
        ...boardData.appState,
        collaborators: new Map(),
      };

      // Delay to ensure Excalidraw is initialized
      setTimeout(() => {
        api.updateScene({
          elements: boardData.elements || [],
          appState: fixedAppState,
          files: boardData.files || {},
        });
        api.scrollToContent(boardData.elements || []);
        setIsLoaded(true);
      }, 300);
    } else {
      setIsLoaded(true);
    }
  }, [api, boardId, isLoaded]);

  // ✅ Manual Save Button handler
  const handleSave = () => {
    if (!api || !boardId) return;
    setIsSaving(true);

    const elements = api.getSceneElements();
    const appState = api.getAppState();
    const files = api.getFiles();

    const safeAppState = { ...appState, collaborators: {} };

    // Get existing board metadata (name, emoji)
    const savedBoards = JSON.parse(localStorage.getItem("boards") || "{}");
    const existingBoard = savedBoards[boardId] || {
      id: boardId,
      name: "Untitled Board",
      emoji: "🖌️",
    };

    const updatedBoard = {
      ...existingBoard,
      elements,
      appState: safeAppState,
      files,
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage
    savedBoards[boardId] = updatedBoard;
    localStorage.setItem("boards", JSON.stringify(savedBoards));

    // Also save individually
    localStorage.setItem(`board_${boardId}`, JSON.stringify(updatedBoard));

    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Excalidraw Area */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
        }}>
        <Excalidraw
          theme="dark"
          excalidrawAPI={(excalidrawApi) => setApi(excalidrawApi)}
          UIOptions={{
            canvasActions: {
              // keeps the other buttons
              changeColor: true,
            },

            renderCustomUI: true,
          }}
          defaultOptions={{
            elementBackgroundColor: "red", // sets default element color
            primaryColor: "red", // sets the primary theme color to red
          }}
          renderTopLeftUI={() => (
            <button
              onClick={() => setShowCommandPallet(true)}
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
              }}>
              Add Component
            </button>
          )}
          renderTopRightUI={() => (
            <button
              onClick={() => setShowCommandPallet(true)}
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
              }}>
              Add Component
            </button>
          )}
        />

        {/* Save Button */}
        <button
          onClick={handleSave}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            background: isSaving ? "#2e8b57" : "#232329",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 14px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease-in-out",
            zIndex: 50,
          }}>
          {isSaving ? "✅ Saved!" : "💾 Save Board"}
        </button>

        {/* Floating Notion + Command Palette */}
        {showCommandPallet && (
          <CommandPallet
            onClose={() => setShowCommandPallet(false)}
            floatingNotionAction={() => setShowFloatingNotion(true)}
          />
        )}

        {showFloatingNotion && (
          <FloatingNotion
            title="Custom Floating Card"
            onClose={() => setShowFloatingNotion(false)}
          />
        )}
      </div>
    </div>
  );
}
