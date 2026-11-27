const SVG_NS = 'http://www.w3.org/2000/svg';

function svgIcon(paths: string[]): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
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
  play: () => svgIcon(['M6 4l14 8-14 8V4z']),
  pause: () => svgIcon(['M6 4h4v16H6z', 'M14 4h4v16h-4z']),
  copy: () =>
    svgIcon([
      'M9 9h11v11H9z',
      'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
    ]),
  mirror: () =>
    svgIcon(['M12 3v18', 'M8 7l-4 5 4 5', 'M16 7l4 5-4 5']),
  spark: () =>
    svgIcon(['M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z']),
  frame: () =>
    svgIcon([
      'M4 7V4h3',
      'M20 7V4h-3',
      'M4 17v3h3',
      'M20 17v3h-3',
      'M8 8h8v8H8z',
    ]),
  clock: () =>
    svgIcon(['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 6v6l4 2']),
  save: () =>
    svgIcon([
      'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z',
      'M17 21v-8H7v8',
      'M7 3v5h8',
    ]),
};
