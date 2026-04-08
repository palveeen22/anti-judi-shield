const BLUR_CLASS = "anti-judi-blurred";
const BLUR_STYLE_ID = "anti-judi-blur-styles";

export function injectBlurStyles(): void {
  if (document.getElementById(BLUR_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = BLUR_STYLE_ID;
  style.textContent = `
    .${BLUR_CLASS} {
      filter: blur(20px) !important;
      pointer-events: none !important;
      user-select: none !important;
      position: relative !important;
      transition: filter 0.3s ease !important;
    }
    .${BLUR_CLASS}::after {
      content: '' !important;
      position: absolute !important;
      inset: 0 !important;
      background: rgba(220, 38, 38, 0.1) !important;
      z-index: 9998 !important;
    }
  `;
  document.head.appendChild(style);
}

export function blurElement(element: Element): void {
  injectBlurStyles();
  element.classList.add(BLUR_CLASS);
}

export function blurElements(elements: Element[]): void {
  if (elements.length === 0) return;
  injectBlurStyles();
  for (const el of elements) {
    el.classList.add(BLUR_CLASS);
  }
}

export function unblurElement(element: Element): void {
  element.classList.remove(BLUR_CLASS);
}
