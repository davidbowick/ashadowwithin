type GlitchOptions = {
  subtle?: boolean;
  hoverBoost?: boolean;
};

export function applyGlitch(el: HTMLElement, opts: GlitchOptions = {}) {
  const clones: HTMLElement[] = [];

  function createClone(extraClass: string, zIndex: number, blendMode?: string) {
    const clone = el.cloneNode(true) as HTMLElement;
    clone.classList.add(extraClass);
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.width = "100%";
    clone.style.height = "100%";
    clone.style.zIndex = String(zIndex);
    if (blendMode) clone.style.mixBlendMode = blendMode;
    el.style.position = "relative";
    el.appendChild(clone);
    clones.push(clone);
    return clone;
  }

  // Back and front layers
  const back = createClone("glitch-back", 1);
  const front1 = createClone("glitch-front1", 2);
  const front2 = createClone("glitch-front2", 3, "hue");

  function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let running = true;

  function animate() {
    if (!running) return;

    [back, front1, front2].forEach((clone, i) => {
      const top = rand(5, 95);
      const bottom = rand(5, 95);
      clone.style.clipPath = `inset(${top}% 0 ${bottom}% 0)`;

      const shift = opts.subtle ? rand(-2, 2) : rand(-4, 4);
      clone.style.transform = `translate(${shift}px, 0)`;
    });

    setTimeout(animate, rand(200, 600));
  }

  animate();

  if (opts.hoverBoost) {
    el.addEventListener("mouseenter", () => {
      clones.forEach((c) => (c.style.transition = "transform 0.1s"));
    });
    el.addEventListener("mouseleave", () => {
      clones.forEach((c) => (c.style.transition = "transform 0.3s"));
    });
  }

  return () => {
    running = false;
    clones.forEach((c) => c.remove());
  };
}