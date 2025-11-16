"use client";
import React, { useRef, useEffect, useState } from "react";
import { drawExcalidrawElements } from "./boardApi";

// The example content provided by the user.
const placeholderMarkdown = `
# API Overview

This API allows users to authenticate, fetch resources, and update dat authenticate, fetch resources, and update dat

a. Below is a detailed description of the endpoints and how they intera

ct. The text is long enough to wrap naturally within the available width.

> Remember: Always use HTTPS and include an authorization token in the headers.

>> ok this is a memo and you can use this and see this.

After a successful authentication, you’ll receive a JSON response that incl\\nudes your session details, permissions, and expiration time. If authentication fails, the response will include an appropriate error message.

---

# Sample Request
`;

export default function FloatingCard({ onClose, onSave }) {
  const containerRef = useRef(null);
  const [markdownContent, setMarkdownContent] = useState(placeholderMarkdown);

  // Optional: close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
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

  // Handler for textarea changes
  const handleEditorChange = (event) => {
    setMarkdownContent(event.target.value);
  };

  const applyMarkdownToLine = (mark) => {
    const textarea = containerRef.current.querySelector("textarea");
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;

    // Find start and end of the current line
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const lineEnd = value.indexOf("\n", selectionStart);
    const lineActualEnd = lineEnd === -1 ? value.length : lineEnd;

    const currentLine = value.slice(lineStart, lineActualEnd);

    // Determine replacement text
    let newLine;
    switch (mark) {
      case "#":
        newLine = `# ${currentLine.replace(/^#+\s*/, "")}`;
        break;
      case ">":
        newLine = `> ${currentLine.replace(/^>\s*/, "")}`;
        break;
      case ">>":
        newLine = `>> ${currentLine.replace(/^>>\s*/, "")}`;
        break;
      case "---":
        newLine = "---";
        break;
      case "para":
        newLine = currentLine.replace(/^(\#|>|\>\>)\s*/, "");
        break;
      default:
        newLine = currentLine;
    }

    // Update textarea value
    textarea.value =
      value.slice(0, lineStart) + newLine + value.slice(lineActualEnd);

    // Dispatch input event to allow undo
    const inputEvent = new Event("input", { bubbles: true });
    textarea.dispatchEvent(inputEvent);

    // Keep cursor at end of modified line
    const cursorPos = lineStart + newLine.length;
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = cursorPos;
      textarea.focus();
    }, 0);
  };

  const handleSave = () => {
    // 1. Run the save function
    drawExcalidrawElements("markdown", markdownContent);
    onClose?.();
  };

  return (
    <div
      className="
    fixed inset-0 w-full h-full 
    bg-black/50 backdrop-blur-sm 
    flex justify-center items-center 
    z-1000
  "
    >
      <div
        ref={containerRef}
        className="
      w-1/2 h-[90%] bg-[#101010] 
      shadow-2xl 
      p-10 overflow-y-auto 
      flex flex-col scrollbar-none
    "
      >
        {/* Buttons at the top */}
        <div className="flex gap-3 mb-5">
          {["# Heading", "> Quote", ">> Mem", "---"].map((mark) => (
            <button
              key={mark}
              onClick={() => applyMarkdownToLine(mark)}
              className="
            px-4 py-2 rounded-md font-outfit
            bg-[#2e2e2e] text-[#cccccc] 
            hover:bg-[#3a3a3a] cursor-pointer
            text-base
          "
            >
              {mark}
            </button>
          ))}
        </div>

        {/* Markdown Editor */}
        <textarea
          value={markdownContent}
          onChange={handleEditorChange}
          spellCheck="false"
          placeholder="Start writing your Markdown here..."
          className=" 
        grow w-full min-h-[100px]
        p-4
        rounded-md bg-[#1e1e1e] text-[#cccccc]
        text-base leading-relaxed font-mono
        resize-none box-border outline-none scrollbar-none
      "
        />

        {/* Bottom Cancel/Save Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="
          px-5 py-2 rounded-md 
          bg-[#2e2e2e] text-[#cccccc] 
          hover:bg-[#3a3a3a]
          text-base cursor-pointer
          font-outfit
        "
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="
          px-5 py-2 rounded-md font-outfit
          bg-[#007acc] text-white 
          text-base  cursor-pointer 
          transition-colors duration-200
          hover:bg-[#0090ff]
        "
          >
            Add Markdown
          </button>
        </div>
      </div>
    </div>
  );
}
