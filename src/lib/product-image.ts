function buildFallbackSvg(label: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fff9fc"/>
          <stop offset="55%" stop-color="#fde5ef"/>
          <stop offset="100%" stop-color="#f6b5d1"/>
        </linearGradient>
      </defs>
      <rect width="800" height="1000" rx="48" fill="url(#bg)"/>
      <circle cx="640" cy="180" r="130" fill="rgba(214,76,139,0.14)"/>
      <circle cx="170" cy="840" r="180" fill="rgba(243,141,183,0.18)"/>
      <text x="50%" y="47%" text-anchor="middle" fill="#341f29" font-size="44" font-family="Georgia, serif">${label}</text>
      <text x="50%" y="54%" text-anchor="middle" fill="#b83773" font-size="24" font-family="Aptos, Segoe UI, sans-serif">Mehar Pardha</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function getProductImageUrl(image: string, label: string) {
  return image || buildFallbackSvg(label);
}

export function getProductBackground(image: string, label: string, overlay = "rgba(214,76,139,0.16)") {
  const safeImage = getProductImageUrl(image, label);
  return `linear-gradient(${overlay}, ${overlay}), url("${safeImage}")`;
}
