const SVG_NS = 'http://www.w3.org/2000/svg';

function svgIcon(paths: string[], size = 15): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');

  for (const d of paths) {
    const p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', d);
    svg.appendChild(p);
  }
  return svg;
}

export const uiGlyphs = {
  play: (s = 14) => svgIcon(['M6 4l14 8-14 8V4z'], s),
  pause: (s = 14) => svgIcon(['M6 4h4v16H6z', 'M14 4h4v16h-4z'], s),
  reset: (s = 14) => svgIcon(['M3 12a9 9 0 1 0 3-6.7L3 8', 'M3 3v5h5'], s),
  copy: (s = 14) =>
    svgIcon(['M9 9h11v11H9z', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'], s),
  check: (s = 14) => svgIcon(['M20 6L9 17l-5-5'], s),
  mirror: (s = 14) => svgIcon(['M12 3v18', 'M8 7l-4 5 4 5', 'M16 7l4 5-4 5'], s),
  spark: (s = 14) =>
    svgIcon(['M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z'], s),
  frame: (s = 15) =>
    svgIcon(['M4 7V4h3', 'M20 7V4h-3', 'M4 17v3h3', 'M20 17v3h-3', 'M8 8h8v8H8z'], s),
  clock: (s = 15) =>
    svgIcon(['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 6v6l4 2'], s),
  save: (s = 14) =>
    svgIcon(
      ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z', 'M17 21v-8H7v8', 'M7 3v5h8'],
      s,
    ),
  close: (s = 12) => svgIcon(['M18 6L6 18', 'M6 6l12 12'], s),
};
