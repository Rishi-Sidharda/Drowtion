export function generateElements({ component, appState }) {
  const { scrollX, scrollY, zoom, width, height } = appState;

  const centerX = -scrollX + width / (2 * (zoom.value || zoom));
  const centerY = -scrollY + height / (2 * (zoom.value || zoom));

  const randomOffset = (range) => (Math.random() - 0.5) * range;
  const offsetX = randomOffset(200);
  const offsetY = randomOffset(150);

  const x = centerX + offsetX;
  const y = centerY + offsetY;

  // Placeholder markdown text
  const placeholderMarkdown = `
# My Notes

This is a paragraph explaining something important.

> This is a quote block like Notion.

---

Another paragraph after a horizontal rule.
`;

  // Utility to generate a unique group ID
  const generateGroupId = () =>
    `markdown-${Math.random().toString(36).substr(2, 9)}`;

  // Function to generate a markdown page
  const generateMarkdownPage = (markdownText) => {
    const groupId = generateGroupId(); // all elements share this groupId
    const pageWidth = 600;
    const pageHeight = 800;
    const padding = 40;
    const lineSpacing = 30;
    let currentY = centerY - pageHeight / 2 + padding;

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
      groupIds: [groupId],
    };

    const elements = [pageRect];
    const lines = markdownText.split("\n");

    lines.forEach((line) => {
      line = line.trim();
      if (!line) {
        currentY += lineSpacing / 2;
        return;
      }

      let element = null;

      if (line.startsWith("# ")) {
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
          groupIds: [groupId],
        };
        currentY += 50 + 10;
      } else if (line.startsWith("> ")) {
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
          groupIds: [groupId],
        };
        currentY += 40 + 10;
      } else if (/^---+$/.test(line)) {
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
          groupIds: [groupId],
        };
        currentY += 20;
      } else {
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
          groupIds: [groupId],
        };
        currentY += 40 + 10;
      }

      if (element) elements.push(element);
    });

    return elements;
  };

  // Default shapes map
  const componentsMap = {
    rectangle: {
      type: "rectangle",
      x: x - 125,
      y: y - 100,
      width: 250,
      height: 200,
      backgroundColor: "transparent",
      strokeColor: "#000000",
      strokeWidth: 2,
      roughness: 1,
      opacity: 100,
    },
    ellipse: {
      type: "ellipse",
      x: x - 125,
      y: y - 100,
      width: 250,
      height: 200,
      strokeColor: "#000000",
      backgroundColor: "transparent",
      strokeWidth: 2,
      roughness: 1,
      opacity: 100,
    },
    diamond: {
      type: "diamond",
      x: x - 100,
      y: y - 100,
      width: 200,
      height: 200,
      strokeColor: "#000000",
      backgroundColor: "transparent",
      strokeWidth: 2,
      roughness: 1,
      opacity: 100,
    },
    text: {
      type: "text",
      x: x - 120 / 2,
      y: y - 20 / 2,
      text: "Created at",
      fontSize: 24,
      width: 100,
      height: 100,
      fontFamily: 1,
      textAlign: "center",
      verticalAlign: "middle",
      strokeColor: "#2ECC71",
      backgroundColor: "transparent",
      strokeWidth: 2,
      roughness: 1,
      opacity: 100,
    },
    markdown: generateMarkdownPage(placeholderMarkdown), // grouped markdown
  };

  const element = componentsMap[component] || componentsMap.rectangle;

  // Always return an array
  return Array.isArray(element) ? element : [element];
}
