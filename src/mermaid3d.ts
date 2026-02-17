import type {
  MermaidConfig,
  RenderResult,
  RunOptions,
  ParseResult,
} from './pipeline/types';

let globalConfig: MermaidConfig = {};
let mermaidLib: any = null;

async function ensureMermaid() {
  if (!mermaidLib) {
    // Check for global mermaid first (UMD/CDN usage where mermaid is loaded
    // via <script> tag). Dynamic import('mermaid') fails from cross-origin
    // CDN scripts because bare specifier resolution uses about:blank as base.
    if (typeof window !== 'undefined' && (window as any).mermaid) {
      mermaidLib = (window as any).mermaid;
    } else {
      const m = await import('mermaid');
      mermaidLib = m.default || m;
    }
    mermaidLib.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      ...(globalConfig as Record<string, unknown>),
    });
  }
  return mermaidLib;
}

let renderCounter = 0;

const SVG_NS = 'http://www.w3.org/2000/svg';

// ─── Isometric projection matrix (2D) ─────────────────────────────
//
// Equivalent to rotateX(45°) then rotateZ(-45°) projected orthographically:
//   x' =  0.707·x + 0.707·y
//   y' = -0.500·x + 0.500·y
//
// SVG matrix(a,b,c,d,e,f):  x' = a·x + c·y + e,  y' = b·x + d·y + f
const ISO_A = 0.707, ISO_B = -0.5, ISO_C = 0.707, ISO_D = 0.5;
const ISO_MATRIX = `matrix(${ISO_A} ${ISO_B} ${ISO_C} ${ISO_D} 0 0)`;

// ─── SVG Shadow Filter ─────────────────────────────────────────────

function addNodeShadows(svgEl: SVGSVGElement): void {
  let defs = svgEl.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS(SVG_NS, 'defs');
    svgEl.insertBefore(defs, svgEl.firstChild);
  }

  const filter = document.createElementNS(SVG_NS, 'filter');
  filter.setAttribute('id', 'mermaid3d-shadow');
  filter.setAttribute('x', '-30%');
  filter.setAttribute('y', '-30%');
  filter.setAttribute('width', '180%');
  filter.setAttribute('height', '180%');

  const feOffset = document.createElementNS(SVG_NS, 'feOffset');
  feOffset.setAttribute('in', 'SourceAlpha');
  feOffset.setAttribute('dx', '6');
  feOffset.setAttribute('dy', '8');
  feOffset.setAttribute('result', 'offsetAlpha');
  filter.appendChild(feOffset);

  const feBlur = document.createElementNS(SVG_NS, 'feGaussianBlur');
  feBlur.setAttribute('in', 'offsetAlpha');
  feBlur.setAttribute('stdDeviation', '5');
  feBlur.setAttribute('result', 'blurred');
  filter.appendChild(feBlur);

  const feFlood = document.createElementNS(SVG_NS, 'feFlood');
  feFlood.setAttribute('flood-color', 'black');
  feFlood.setAttribute('flood-opacity', '0.25');
  feFlood.setAttribute('result', 'color');
  filter.appendChild(feFlood);

  const feComposite = document.createElementNS(SVG_NS, 'feComposite');
  feComposite.setAttribute('in', 'color');
  feComposite.setAttribute('in2', 'blurred');
  feComposite.setAttribute('operator', 'in');
  feComposite.setAttribute('result', 'shadow');
  filter.appendChild(feComposite);

  const feMerge = document.createElementNS(SVG_NS, 'feMerge');
  const mergeNode1 = document.createElementNS(SVG_NS, 'feMergeNode');
  mergeNode1.setAttribute('in', 'shadow');
  feMerge.appendChild(mergeNode1);
  const mergeNode2 = document.createElementNS(SVG_NS, 'feMergeNode');
  mergeNode2.setAttribute('in', 'SourceGraphic');
  feMerge.appendChild(mergeNode2);
  filter.appendChild(feMerge);

  defs.appendChild(filter);

  const targets: SVGElement[] = [];

  // Flowchart, class, state, ER, mindmap — all use .node groups
  svgEl.querySelectorAll('.node').forEach(el => targets.push(el as SVGElement));

  // Sequence diagrams — actor boxes (top & bottom) inside <g> groups
  svgEl.querySelectorAll('rect.actor').forEach(el => {
    const parent = el.closest('g[id]') || el.parentElement;
    if (parent && parent.tagName === 'g' && !targets.includes(parent as SVGElement)) {
      targets.push(parent as SVGElement);
    }
  });

  // Journey diagrams — task bars and section headers
  svgEl.querySelectorAll('rect.task').forEach(el => targets.push(el as SVGElement));
  svgEl.querySelectorAll('rect.journey-section').forEach(el => targets.push(el as SVGElement));

  // Pie diagrams — shadow the parent group containing all slices (not each slice)
  const firstSlice = svgEl.querySelector('path.pieCircle');
  if (firstSlice?.parentElement?.tagName === 'g') {
    targets.push(firstSlice.parentElement as unknown as SVGElement);
  }

  // Gantt diagrams — task bars (class starts with "task")
  svgEl.querySelectorAll('rect[class*="task"]').forEach(el => {
    if (!targets.includes(el as SVGElement)) {
      targets.push(el as SVGElement);
    }
  });

  // Git graph — commit bullets group + arrows group (for connecting lines)
  const commitBullets = svgEl.querySelector('g.commit-bullets:not(:empty)');
  if (commitBullets) targets.push(commitBullets as SVGElement);
  const commitArrows = svgEl.querySelector('g.commit-arrows');
  if (commitArrows) targets.push(commitArrows as SVGElement);
  svgEl.querySelectorAll('line.branch').forEach(el => targets.push(el as SVGElement));
  svgEl.querySelectorAll('.branchLabel').forEach(el => targets.push(el as SVGElement));
  svgEl.querySelectorAll('rect.branchLabelBkg').forEach(el => targets.push(el as SVGElement));

  // Timeline — timeline-node groups
  svgEl.querySelectorAll('.timeline-node').forEach(el => targets.push(el as SVGElement));

  for (const el of targets) {
    el.setAttribute('filter', 'url(#mermaid3d-shadow)');
  }
}

// ─── Isometric SVG transform ──────────────────────────────────────

function applyIsometricTransform(svgEl: SVGSVGElement): void {
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('transform', ISO_MATRIX);

  while (svgEl.firstChild) {
    g.appendChild(svgEl.firstChild);
  }
  svgEl.appendChild(g);

  // getBBox() returns the UNTRANSFORMED content bbox.
  // We need the bbox AFTER the isometric matrix is applied.
  const bbox = g.getBBox();
  const corners = [
    [bbox.x, bbox.y],
    [bbox.x + bbox.width, bbox.y],
    [bbox.x + bbox.width, bbox.y + bbox.height],
    [bbox.x, bbox.y + bbox.height],
  ];

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [px, py] of corners) {
    const tx = ISO_A * px + ISO_C * py;
    const ty = ISO_B * px + ISO_D * py;
    minX = Math.min(minX, tx);
    minY = Math.min(minY, ty);
    maxX = Math.max(maxX, tx);
    maxY = Math.max(maxY, ty);
  }

  const pad = 30;
  svgEl.setAttribute(
    'viewBox',
    `${minX - pad} ${minY - pad} ${maxX - minX + 2 * pad} ${maxY - minY + 2 * pad}`,
  );
}

// ─── Pan & Zoom (viewBox-based — stays vector, never pixelates) ───

interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

function parseViewBox(svgEl: SVGSVGElement): ViewBox {
  const parts = (svgEl.getAttribute('viewBox') || '0 0 800 600')
    .split(/[\s,]+/)
    .map(Number);
  return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
}

/**
 * Adjust the viewBox so its aspect ratio matches the container,
 * centering the content. Combined with preserveAspectRatio="none",
 * this gives a 1:1 pixel-to-viewBox-unit mapping on both axes.
 */
function fitViewBoxToContainer(
  contentVB: ViewBox,
  container: HTMLDivElement,
): ViewBox {
  const rect = container.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return contentVB;

  const containerAR = rect.width / rect.height;
  const contentAR = contentVB.w / contentVB.h;

  if (containerAR > contentAR) {
    // Container is wider — expand viewBox width
    const newW = contentVB.h * containerAR;
    return {
      x: contentVB.x - (newW - contentVB.w) / 2,
      y: contentVB.y,
      w: newW,
      h: contentVB.h,
    };
  } else {
    // Container is taller — expand viewBox height
    const newH = contentVB.w / containerAR;
    return {
      x: contentVB.x,
      y: contentVB.y - (newH - contentVB.h) / 2,
      w: contentVB.w,
      h: newH,
    };
  }
}

function setupPanZoom(
  container: HTMLDivElement,
  svgEl: SVGSVGElement,
): void {
  // Use preserveAspectRatio="none" so viewBox maps directly to container pixels.
  // We maintain the aspect ratio ourselves via fitViewBoxToContainer.
  svgEl.setAttribute('preserveAspectRatio', 'none');

  const contentVB = parseViewBox(svgEl);
  let vb = fitViewBoxToContainer(contentVB, container);

  let isPanning = false;
  let lastX = 0;
  let lastY = 0;
  let animId = 0;

  function applyVB() {
    svgEl.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  }

  applyVB();

  function cancelAnim() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = 0;
    }
  }

  function animateTo(target: ViewBox, duration = 600) {
    cancelAnim();
    const from = { ...vb };
    const start = performance.now();

    function step(time: number) {
      const t = Math.min((time - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic

      vb.x = from.x + (target.x - from.x) * ease;
      vb.y = from.y + (target.y - from.y) * ease;
      vb.w = from.w + (target.w - from.w) * ease;
      vb.h = from.h + (target.h - from.h) * ease;
      applyVB();

      if (t < 1) {
        animId = requestAnimationFrame(step);
      } else {
        animId = 0;
      }
    }

    animId = requestAnimationFrame(step);
  }

  // ── Wheel → zoom towards cursor ──────────────────────────────
  container.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      cancelAnim();

      const factor = e.deltaY > 0 ? 1.08 : 1 / 1.08;
      const rect = container.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;

      const newW = vb.w * factor;
      const newH = vb.h * factor;

      vb.x -= (newW - vb.w) * mx;
      vb.y -= (newH - vb.h) * my;
      vb.w = newW;
      vb.h = newH;

      applyVB();
    },
    { passive: false },
  );

  // ── Mouse drag → pan ─────────────────────────────────────────
  container.addEventListener('mousedown', (e) => {
    if (e.button === 0 || e.button === 1) {
      cancelAnim();
      isPanning = true;
      lastX = e.clientX;
      lastY = e.clientY;
      container.style.cursor = 'grabbing';
      e.preventDefault();
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    const rect = container.getBoundingClientRect();
    vb.x -= dx * (vb.w / rect.width);
    vb.y -= dy * (vb.h / rect.height);
    applyVB();
  });

  window.addEventListener('mouseup', () => {
    if (isPanning) {
      isPanning = false;
      container.style.cursor = 'grab';
    }
  });

  // ── Double-click → fly to node ───────────────────────────────
  container.addEventListener('dblclick', (e) => {
    const nodeEl = (e.target as Element).closest('.node');
    if (!nodeEl) return;

    const nodeBCR = nodeEl.getBoundingClientRect();
    const rect = container.getBoundingClientRect();

    // Convert node center from screen pixels to current viewBox coordinates
    const cx =
      vb.x +
      ((nodeBCR.left + nodeBCR.width / 2 - rect.left) / rect.width) * vb.w;
    const cy =
      vb.y +
      ((nodeBCR.top + nodeBCR.height / 2 - rect.top) / rect.height) * vb.h;

    // Node size in viewBox units
    const nodeW = (nodeBCR.width / rect.width) * vb.w;
    const nodeH = (nodeBCR.height / rect.height) * vb.h;

    // Zoom so the node occupies ~20% of the viewport
    const nodeSize = Math.max(nodeW, nodeH);
    const targetW = nodeSize / 0.2;
    const targetH = targetW * (rect.height / rect.width);

    animateTo({
      x: cx - targetW / 2,
      y: cy - targetH / 2,
      w: targetW,
      h: targetH,
    });
  });

  // ── Touch: 1-finger pan, 2-finger pinch zoom ────────────────
  let lastTouchDist = 0;

  container.addEventListener(
    'touchstart',
    (e) => {
      cancelAnim();
      if (e.touches.length === 1) {
        isPanning = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        isPanning = false;
        const tdx = e.touches[1].clientX - e.touches[0].clientX;
        const tdy = e.touches[1].clientY - e.touches[0].clientY;
        lastTouchDist = Math.sqrt(tdx * tdx + tdy * tdy);
      }
      e.preventDefault();
    },
    { passive: false },
  );

  container.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length === 1 && isPanning) {
        const dx = e.touches[0].clientX - lastX;
        const dy = e.touches[0].clientY - lastY;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;

        const rect = container.getBoundingClientRect();
        vb.x -= dx * (vb.w / rect.width);
        vb.y -= dy * (vb.h / rect.height);
        applyVB();
      } else if (e.touches.length === 2) {
        const tdx = e.touches[1].clientX - e.touches[0].clientX;
        const tdy = e.touches[1].clientY - e.touches[0].clientY;
        const dist = Math.sqrt(tdx * tdx + tdy * tdy);
        const factor = lastTouchDist / dist;

        const rect = container.getBoundingClientRect();
        const mx =
          ((e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left) /
          rect.width;
        const my =
          ((e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top) /
          rect.height;

        const newW = vb.w * factor;
        const newH = vb.h * factor;
        vb.x -= (newW - vb.w) * mx;
        vb.y -= (newH - vb.h) * my;
        vb.w = newW;
        vb.h = newH;
        lastTouchDist = dist;

        applyVB();
      }
      e.preventDefault();
    },
    { passive: false },
  );

  container.addEventListener('touchend', () => {
    isPanning = false;
  });

  container.style.cursor = 'grab';
}

// ─── Container & Styles ────────────────────────────────────────────

const STYLES = `
.mermaid-3d-container {
  overflow: hidden;
  position: relative;
}
.mermaid-3d-container svg {
  display: block;
  width: 100%;
  height: 100%;
}
`;

function ensureStyles(): void {
  if (document.getElementById('mermaid-3d-styles')) return;
  const style = document.createElement('style');
  style.id = 'mermaid-3d-styles';
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function createContainer(id: string): HTMLDivElement {
  const container = document.createElement('div');
  container.id = id;
  container.className = 'mermaid-3d-container';
  // position: relative is set via the STYLES class rule above.
  // Do NOT set position: absolute / inset: 0 — that breaks document flow.
  return container;
}

// ─── Public API ────────────────────────────────────────────────────

const mermaid3d = {
  initialize(config: MermaidConfig = {}): void {
    globalConfig = { ...globalConfig, ...config };
    mermaidLib = null;
  },

  async render(
    id: string,
    text: string,
    containerElement?: Element,
  ): Promise<RenderResult> {
    ensureStyles();
    const mermaid = await ensureMermaid();

    const renderId = `mermaid3d-render-${renderCounter++}`;
    const { svg } = await mermaid.render(renderId, text);

    const container = createContainer(id);
    container.innerHTML = svg;

    if (containerElement) {
      containerElement.appendChild(container);
    }

    const svgEl = container.querySelector('svg');

    // finalize() applies the isometric transform, shadows, and pan/zoom.
    // It MUST be called after the container is in the DOM, because
    // getBBox() returns zeros on detached elements.
    const finalize = () => {
      if (!svgEl) return;
      // Remove mermaid's fixed/max dimensions so SVG fills container
      svgEl.removeAttribute('width');
      svgEl.removeAttribute('height');
      svgEl.style.maxWidth = 'none';

      // Add floating shadows to nodes (enabled by default)
      if (globalConfig.shadows !== false) {
        addNodeShadows(svgEl);
      }

      // Apply isometric transform in SVG space (stays vector)
      applyIsometricTransform(svgEl);

      // Wire up viewBox-based pan & zoom (also centers the content)
      setupPanZoom(container, svgEl);
    };

    // If the container was appended to a parent (containerElement),
    // it's in the DOM now — finalize immediately.
    if (containerElement) {
      finalize();
    }

    return {
      svg,
      element: container,
      bindFunctions: (_el: Element) => {},
      finalize,
    };
  },

  async run(options?: RunOptions): Promise<void> {
    const selector =
      options?.querySelector || 'pre.mermaid, div.mermaid, .mermaid';
    const nodes = options?.nodes
      ? Array.from(options.nodes)
      : Array.from(document.querySelectorAll<HTMLElement>(selector));

    for (let i = 0; i < nodes.length; i++) {
      const element = nodes[i];
      const text = element.textContent?.trim();
      if (!text) continue;

      const id = element.id || `mermaid-3d-${i}`;

      try {
        const result = await this.render(id, text);
        const parent = element.parentNode;
        if (parent) {
          result.element.id = id;
          parent.replaceChild(result.element, element);
          // Now that the element is in the DOM, finalize applies the
          // isometric transform and pan/zoom (getBBox needs a live element).
          result.finalize();
        }

        if (options?.postRenderCallback) {
          options.postRenderCallback(id);
        }
      } catch (err) {
        if (!options?.suppressErrors) {
          console.error(`mermaid-3d: Failed to render diagram ${id}:`, err);
        }
      }
    }
  },

  async parse(
    text: string,
    _parseOptions?: Record<string, unknown>,
  ): Promise<ParseResult> {
    const mermaid = await ensureMermaid();
    const result = await mermaid.parse(text);
    return { diagramType: result?.diagramType || 'unknown' };
  },

  async registerExternalDiagrams(diagrams: unknown[]): Promise<void> {
    const mermaid = await ensureMermaid();
    if (typeof mermaid.registerExternalDiagrams === 'function') {
      await mermaid.registerExternalDiagrams(
        diagrams as Parameters<typeof mermaid.registerExternalDiagrams>[0],
      );
    }
  },

  setParseErrorHandler(handler: (err: unknown, hash: unknown) => void): void {
    (globalConfig as Record<string, unknown>).__parseErrorHandler = handler;
  },

  mermaidAPI: {
    initialize(config: MermaidConfig): void {
      mermaid3d.initialize(config);
    },
    async render(
      id: string,
      text: string,
      el?: Element,
    ): Promise<RenderResult> {
      return mermaid3d.render(id, text, el);
    },
    async parse(text: string): Promise<ParseResult> {
      return mermaid3d.parse(text);
    },
  },
};

export default mermaid3d;
