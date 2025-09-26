export function videoCoverStyles(width: number, height: number) {
  const ratio = width / height;
  const heightVW = (100 / ratio).toFixed(2);
  const minWidthVH = (100 * ratio).toFixed(2);

  // Inline style object (React-friendly)
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    width: "100vw",
    height: `${heightVW}vw`,
    minWidth: `${minWidthVH}vh`,
    minHeight: "100vh",
    transform: "translate(-50%, -50%)",
  };

  // Raw CSS block (string)
  const css = `
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100vw;
    height: ${heightVW}vw;
    min-width: ${minWidthVH}vh;
    min-height: 100vh;
    transform: translate(-50%, -50%);
  `;

  return { style, css };
}