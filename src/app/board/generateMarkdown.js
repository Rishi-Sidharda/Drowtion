export function generateMarkdown({ markdown, appState }) {
  const { scrollX, scrollY, zoom, width, height } = appState;

  // Center of the current visible canvas
  const centerX = -scrollX + width / (2 * (zoom.value || zoom));
  const centerY = -scrollY + height / (2 * (zoom.value || zoom));

  // Page dimensions
  const pageWidth = 600;
  const pageHeight = 800;
  const padding = 40;
  const lineSpacing = 30;

  // Start position for content
  let currentY = centerY - pageHeight / 2 + padding;

  // Create page rectangle
  const pageRect = {
    type: "rectangle",
    x: centerX - pageWidth / 2,
    y: centerY - pageHeight / 2,
    width: pageWidth,
    height: pageHeight,
    strokeColor: "#000000",
    backgroundColor: "#ffffff",
    strokeWidth: 2,
    roughness: 1,
    opacity: 100,
  };

  const elements = [pageRect];

  // Split markdown by line breaks
  const lines = markdown.split("\n");

  lines.forEach((line) => {
    line = line.trim();
    if (!line) {
      currentY += lineSpacing / 2; // extra spacing for empty lines
      return;
    }

    let element = null;

    if (line.startsWith("# ")) {
      // Heading
      element = {
        type: "text",
        x: centerX - (pageWidth - 2 * padding) / 2,
        y: currentY,
        text: line.replace(/^# /, ""),
        fontSize: 36,
        width: pageWidth - 2 * padding,
        height: 50,
        fontFamily: 1,
        textAlign: "left",
        verticalAlign: "top",
        strokeColor: "#000000",
        backgroundColor: "transparent",
        strokeWidth: 1,
        roughness: 1,
        opacity: 100,
      };
      currentY += 50 + 10;
    } else if (line.startsWith("> ")) {
      // Quote block
      element = {
        type: "text",
        x: centerX - (pageWidth - 2 * padding) / 2 + 10,
        y: currentY,
        text: line.replace(/^> /, ""),
        fontSize: 20,
        width: pageWidth - 2 * padding - 20,
        height: 40,
        fontFamily: 1,
        textAlign: "left",
        verticalAlign: "top",
        strokeColor: "#555555",
        backgroundColor: "#f0f0f0",
        strokeWidth: 1,
        roughness: 1,
        opacity: 100,
      };
      currentY += 40 + 10;
    } else if (/^---+$/.test(line)) {
      // Horizontal rule
      element = {
        type: "line",
        x: centerX - (pageWidth - 2 * padding) / 2,
        y: currentY,
        width: pageWidth - 2 * padding,
        height: 0,
        strokeColor: "#000000",
        strokeWidth: 2,
        roughness: 1,
        opacity: 100,
      };
      currentY += 20;
    } else {
      // Paragraph
      element = {
        type: "text",
        x: centerX - (pageWidth - 2 * padding) / 2,
        y: currentY,
        text: line,
        fontSize: 24,
        width: pageWidth - 2 * padding,
        height: 40,
        fontFamily: 1,
        textAlign: "left",
        verticalAlign: "top",
        strokeColor: "#000000",
        backgroundColor: "transparent",
        strokeWidth: 1,
        roughness: 1,
        opacity: 100,
      };
      currentY += 40 + 10;
    }

    if (element) elements.push(element);
  });

  return elements;
}
