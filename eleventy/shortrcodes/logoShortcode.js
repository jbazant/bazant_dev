function logoShortcode(size, colourInner, colourOuter) {
  return `<svg 
    version="1.1"
    baseProfile="full"
    width="${size}" height="${size}"
    xmlns="http://www.w3.org/2000/svg">
      <g transform="scale(${size / 200})">
        <path
          d="m 24.5 143 l 150 0 l -75 -129.9038 z m 19.0021 -32.4135 l 37.1398 0 l -18.5699 32.164 z m 55.9979 -32.6632 l -18.5699 -32.164 l 37.1398 0 z m 0 64.8272 l -37.2839 -64.5775 l 74.5678 -0.0001 z m 37.428 0 l -18.5699 -32.164 l 37.1398 0 z"
          fill="${colourInner}"
          stroke="none"
        />
        <circle 
          r="90"
          stroke="${colourOuter}"
          fill="none"
          stroke-width="20"
          stroke-dasharray="392 20 26 20 26 20 26 20"
          transform="translate(100, 100) rotate(30)"
        />
      </g>
    </svg>`;
}

module.exports = {
  logoShortcode,
};
