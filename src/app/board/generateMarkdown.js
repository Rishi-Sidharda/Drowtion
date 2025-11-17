// generateMarkdown.js

const STORAGE_KEY = "tenshin";
const BOARD_DATA_KEY = "boardData";

const generateGroupId = () =>
  `markdown-${Math.random().toString(36).substr(2, 9)}`;

function wrapText(text, fontSize, maxWidth) {
  const approxCharWidth = fontSize * 0.7;
  const maxCharsPerLine = Math.floor(maxWidth / approxCharWidth);
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  let maxLineLength = 0; // Tracks the maximum character length of any line/word

  words.forEach((word) => {
    // 1. Handle extremely long words that exceed the current maxCharsPerLine
    if (word.length > maxCharsPerLine) {
      // If the current line has content, push it first
      if (currentLine) {
        lines.push(currentLine);
        maxLineLength = Math.max(maxLineLength, currentLine.length);
      }
      // Push the super-long word as its own line
      lines.push(word);
      maxLineLength = Math.max(maxLineLength, word.length);
      currentLine = ""; // Start a new line after the long word
      return;
    }

    // 2. Original wrapping logic for normal words
    const nextLine = currentLine + (currentLine ? " " : "") + word;

    if (nextLine.length <= maxCharsPerLine) {
      currentLine = nextLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        maxLineLength = Math.max(maxLineLength, currentLine.length);
      }
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
    maxLineLength = Math.max(maxLineLength, currentLine.length);
  }

  // Return both the wrapped lines and the max length found
  return { lines, maxLineLength };
}

export function generateMarkdownPage(centerX, centerY, markdownText) {
  // --- Get current boardId from localStorage ---
  let boardId = null;
  try {
    const tenshinRaw = localStorage.getItem(STORAGE_KEY);
    if (tenshinRaw) {
      const parsed = JSON.parse(tenshinRaw);
      // Choose first board as current if no explicit selection
      boardId = Object.keys(parsed.boards || {})[0] || null;
    }
  } catch (e) {
    console.error("Failed to read boardId from storage", e);
  }

  if (!boardId) {
    console.warn(
      "generateMarkdownPage: no boardId found, cannot save markdown"
    );
  }

  // Ensure markdownText is string
  if (typeof markdownText !== "string") {
    console.warn(
      "generateMarkdownPage received non-string content. Defaulting to empty string."
    );
    markdownText = "";
  }

  const markdownTextRaw = markdownText;

  markdownText = markdownText.replace(/\\n/g, "\n");

  const groupId = generateGroupId();

  // Base width settings
  const BASE_PAGE_WIDTH = 650;
  const padding = 40;
  const lineSpacing = 10;

  // This tracks the maximum required content width and starts with the default content width
  let maxContentWidth = BASE_PAGE_WIDTH - 2 * padding;

  const jitterX = (Math.random() - 0.5) * 2;
  const jitterY = (Math.random() - 0.5) * 2;
  const safeCenterX = Math.round((centerX + jitterX) * 100) / 100;
  const safeCenterY = Math.round((centerY + jitterY) * 100) / 100;

  let contentHeight = padding;
  const elements = [];

  const lines = markdownText.split("\n");
  const processedLines = [];

  lines.forEach((line) => {
    line = line.trim();
    if (!line) {
      contentHeight += lineSpacing * 2;
      processedLines.push({ type: "empty" });
      return;
    }

    let fontSize = 24;
    let isQuote = false;
    let isMem = false;

    if (line.startsWith("# ")) {
      fontSize = 36;
      line = line.replace(/^# /, "");
    } else if (line.startsWith(">> ")) {
      fontSize = 20;
      line = line.replace(/^>> /, "");
      isMem = true;
    } else if (line.startsWith("> ")) {
      fontSize = 20;
      line = line.replace(/^> /, "");
      isQuote = true;
    } else if (/^---+$/.test(line)) {
      processedLines.push({ type: "hr" });
      contentHeight += 20;
      return;
    }

    // Pass the current maxContentWidth for wrapping
    const wrapResult = wrapText(line, fontSize, maxContentWidth);
    const wrappedLines = wrapResult.lines;
    const maxLineLength = wrapResult.maxLineLength;

    // Calculate the width required for the longest line/word
    const approxCharWidth = fontSize * 0.7;
    const requiredLineWidth = maxLineLength * approxCharWidth;

    // Update the overall maximum required content width
    maxContentWidth = Math.max(maxContentWidth, requiredLineWidth);

    processedLines.push({
      type: "text",
      lines: wrappedLines,
      fontSize,
      isQuote,
      isMem,
    });
    contentHeight += wrappedLines.length * (fontSize + lineSpacing);

    if (fontSize === 36) contentHeight += 10;
  });

  // Calculate the final page width, ensuring it's at least the base width
  const finalPageWidth = Math.max(
    BASE_PAGE_WIDTH,
    maxContentWidth + 2 * padding
  );
  const pageHeight = contentHeight + padding;
  const topY = safeCenterY - pageHeight / 2;

  // Calculate element positions based on the final, potentially wider, page
  const contentWidth = finalPageWidth - 2 * padding;
  const textStartX = safeCenterX - contentWidth / 2;
  const textElementWidth = finalPageWidth - 2; // Full width for text element (minus margins/padding logic might be different)

  const pageRect = {
    type: "rectangle",
    x: safeCenterX - finalPageWidth / 2, // Center the rectangle on the new width
    y: topY,
    width: finalPageWidth, // Use the calculated width
    height: pageHeight,
    strokeColor: "#000000",
    backgroundColor: "#ffffff",
    strokeWidth: 2,
    roughness: 1,
    opacity: 100,
    groupIds: [groupId],
  };
  elements.push(pageRect);

  let currentY = topY + padding;

  processedLines.forEach((item) => {
    if (item.type === "empty") {
      currentY += lineSpacing * 2;
    } else if (item.type === "hr") {
      const hrWidth = finalPageWidth - 2 * padding;
      elements.push({
        type: "line",
        x: safeCenterX - hrWidth / 2, // Center the HR
        y: currentY,
        width: hrWidth, // Use adjusted HR width
        height: 0,
        strokeColor: "#000000",
        strokeWidth: 2,
        roughness: 1,
        opacity: 100,
        groupIds: [groupId],
      });
      currentY += 20;
    } else if (item.type === "text") {
      const strokeColor = item.isMem
        ? "#ff8383"
        : item.isQuote
        ? "#555555"
        : "#000000";
      const backgroundColor =
        item.isMem || item.isQuote ? "#f0f0f0" : "transparent";

      item.lines.forEach((lineText) => {
        elements.push({
          type: "text",
          x: textStartX, // Use the adjusted start X position
          y: currentY,
          text: lineText,
          fontSize: item.fontSize,
          width: contentWidth, // Use the adjusted content width
          height: item.fontSize + 8,
          fontFamily: 1,
          textAlign: "left",
          verticalAlign: "top",
          strokeColor,
          backgroundColor,
          strokeWidth: 1,
          roughness: 1,
          opacity: 100,
          groupIds: [groupId],
        });
        currentY += item.fontSize + lineSpacing;
      });

      if (item.fontSize === 36) currentY += 10;
    }
  });

  // --- SAVE TO boardsData ---
  if (boardId) {
    try {
      const boardDataRaw = localStorage.getItem(BOARD_DATA_KEY);
      const boardsData = boardDataRaw ? JSON.parse(boardDataRaw) : {};
      const oldBoard = boardsData[boardId] || {};

      boardsData[boardId] = {
        ...oldBoard,
        elements: oldBoard.elements || [],
        files: oldBoard.files || {},
        appState: oldBoard.appState || {},
        markdown_registry: {
          ...(oldBoard.markdown_registry || {}),
          [groupId]: {
            id: groupId,
            text: markdownTextRaw,
          },
        },
      };

      localStorage.setItem(BOARD_DATA_KEY, JSON.stringify(boardsData));
      console.log(`Markdown saved to board ${boardId}`, groupId);
    } catch (e) {
      console.error("Failed to save markdown to registry", e);
    }
  }

  return elements;
}
