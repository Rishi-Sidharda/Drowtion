export function generateElements(customText) {
  // Define the common element properties
  const commonProps = {
    fontSize: 28,
    fontFamily: 1, // 1: Kiro (default)
    textAlign: "left",
    verticalAlign: "top",
    strokeColor: "#2ECC71", // A nice forest green color
    backgroundColor: "transparent",
    strokeWidth: 2,
    roughness: 1,
    opacity: 100,
  };

  const timeStamp = new Date().toLocaleTimeString();

  return [
    {
      type: "text",
      text: `${customText} (${timeStamp})`,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      ...commonProps,
    },
    {
      type: "text",
      // This second element can have fixed or different content/properties
      text: `Fixed Secondary Note`,
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      ...commonProps,
      strokeColor: "#3498DB", // Different color for the second one
    },
  ];
}
