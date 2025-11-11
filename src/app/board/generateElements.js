export function generateElements({ component, appState }) {
  // appState should come from excalidrawRef.current.getAppState()
  const { scrollX, scrollY, zoom, width, height } = appState;

  // Center of the current visible canvas (accounting for zoom and scroll)
  const centerX = -scrollX + width / (2 * zoom.value || zoom);
  const centerY = -scrollY + height / (2 * zoom.value || zoom);

  const timeStamp = new Date().toLocaleTimeString();

  const componentsMap = {
    rectangle: {
      type: "rectangle",
      x: centerX - 125,
      y: centerY - 100,
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
      x: centerX - 125,
      y: centerY - 100,
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
      x: centerX - 100,
      y: centerY - 100,
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
      x: centerX - 120 / 2,
      y: centerY - 20 / 2,
      text: `Created at`,
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
  };

  const element = componentsMap[component] || componentsMap.rectangle;

  return [element];
}
