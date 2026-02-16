let S = {}, C = null;
async function N() {
  if (!C) {
    const e = await import("mermaid");
    C = e.default || e, C.initialize({
      startOnLoad: !1,
      securityLevel: "loose",
      ...S
    });
  }
  return C;
}
let L = 0;
const g = "http://www.w3.org/2000/svg", X = 0.707, v = -0.5, M = 0.707, I = 0.5, $ = `matrix(${X} ${v} ${M} ${I} 0 0)`;
function R(e) {
  var o;
  let s = e.querySelector("defs");
  s || (s = document.createElementNS(g, "defs"), e.insertBefore(s, e.firstChild));
  const i = document.createElementNS(g, "filter");
  i.setAttribute("id", "mermaid3d-shadow"), i.setAttribute("x", "-30%"), i.setAttribute("y", "-30%"), i.setAttribute("width", "180%"), i.setAttribute("height", "180%");
  const t = document.createElementNS(g, "feOffset");
  t.setAttribute("in", "SourceAlpha"), t.setAttribute("dx", "6"), t.setAttribute("dy", "8"), t.setAttribute("result", "offsetAlpha"), i.appendChild(t);
  const a = document.createElementNS(g, "feGaussianBlur");
  a.setAttribute("in", "offsetAlpha"), a.setAttribute("stdDeviation", "5"), a.setAttribute("result", "blurred"), i.appendChild(a);
  const c = document.createElementNS(g, "feFlood");
  c.setAttribute("flood-color", "black"), c.setAttribute("flood-opacity", "0.25"), c.setAttribute("result", "color"), i.appendChild(c);
  const d = document.createElementNS(g, "feComposite");
  d.setAttribute("in", "color"), d.setAttribute("in2", "blurred"), d.setAttribute("operator", "in"), d.setAttribute("result", "shadow"), i.appendChild(d);
  const l = document.createElementNS(g, "feMerge"), u = document.createElementNS(g, "feMergeNode");
  u.setAttribute("in", "shadow"), l.appendChild(u);
  const p = document.createElementNS(g, "feMergeNode");
  p.setAttribute("in", "SourceGraphic"), l.appendChild(p), i.appendChild(l), s.appendChild(i);
  const h = [];
  e.querySelectorAll(".node").forEach((r) => h.push(r)), e.querySelectorAll("rect.actor").forEach((r) => {
    const f = r.closest("g[id]") || r.parentElement;
    f && f.tagName === "g" && !h.includes(f) && h.push(f);
  }), e.querySelectorAll("rect.task").forEach((r) => h.push(r)), e.querySelectorAll("rect.journey-section").forEach((r) => h.push(r));
  const y = e.querySelector("path.pieCircle");
  ((o = y == null ? void 0 : y.parentElement) == null ? void 0 : o.tagName) === "g" && h.push(y.parentElement), e.querySelectorAll('rect[class*="task"]').forEach((r) => {
    h.includes(r) || h.push(r);
  });
  const n = e.querySelector("g.commit-bullets:not(:empty)");
  n && h.push(n);
  const m = e.querySelector("g.commit-arrows");
  m && h.push(m), e.querySelectorAll("line.branch").forEach((r) => h.push(r)), e.querySelectorAll(".branchLabel").forEach((r) => h.push(r)), e.querySelectorAll("rect.branchLabelBkg").forEach((r) => h.push(r)), e.querySelectorAll(".timeline-node").forEach((r) => h.push(r));
  for (const r of h)
    r.setAttribute("filter", "url(#mermaid3d-shadow)");
}
function B(e) {
  const s = document.createElementNS(g, "g");
  for (s.setAttribute("transform", $); e.firstChild; )
    s.appendChild(e.firstChild);
  e.appendChild(s);
  const i = s.getBBox(), t = [
    [i.x, i.y],
    [i.x + i.width, i.y],
    [i.x + i.width, i.y + i.height],
    [i.x, i.y + i.height]
  ];
  let a = 1 / 0, c = 1 / 0, d = -1 / 0, l = -1 / 0;
  for (const [p, h] of t) {
    const y = X * p + M * h, n = v * p + I * h;
    a = Math.min(a, y), c = Math.min(c, n), d = Math.max(d, y), l = Math.max(l, n);
  }
  const u = 30;
  e.setAttribute(
    "viewBox",
    `${a - u} ${c - u} ${d - a + 2 * u} ${l - c + 2 * u}`
  );
}
function D(e) {
  const s = (e.getAttribute("viewBox") || "0 0 800 600").split(/[\s,]+/).map(Number);
  return { x: s[0], y: s[1], w: s[2], h: s[3] };
}
function _(e, s) {
  const i = s.getBoundingClientRect();
  if (i.width === 0 || i.height === 0) return e;
  const t = i.width / i.height, a = e.w / e.h;
  if (t > a) {
    const c = e.h * t;
    return {
      x: e.x - (c - e.w) / 2,
      y: e.y,
      w: c,
      h: e.h
    };
  } else {
    const c = e.w / t;
    return {
      x: e.x,
      y: e.y - (c - e.h) / 2,
      w: e.w,
      h: c
    };
  }
}
function k(e, s) {
  s.setAttribute("preserveAspectRatio", "none");
  const i = D(s);
  let t = _(i, e), a = !1, c = 0, d = 0, l = 0;
  function u() {
    s.setAttribute("viewBox", `${t.x} ${t.y} ${t.w} ${t.h}`);
  }
  u();
  function p() {
    l && (cancelAnimationFrame(l), l = 0);
  }
  function h(n, m = 600) {
    p();
    const o = { ...t }, r = performance.now();
    function f(w) {
      const b = Math.min((w - r) / m, 1), A = 1 - Math.pow(1 - b, 3);
      t.x = o.x + (n.x - o.x) * A, t.y = o.y + (n.y - o.y) * A, t.w = o.w + (n.w - o.w) * A, t.h = o.h + (n.h - o.h) * A, u(), b < 1 ? l = requestAnimationFrame(f) : l = 0;
    }
    l = requestAnimationFrame(f);
  }
  e.addEventListener(
    "wheel",
    (n) => {
      n.preventDefault(), p();
      const m = n.deltaY > 0 ? 1.08 : 1 / 1.08, o = e.getBoundingClientRect(), r = (n.clientX - o.left) / o.width, f = (n.clientY - o.top) / o.height, w = t.w * m, b = t.h * m;
      t.x -= (w - t.w) * r, t.y -= (b - t.h) * f, t.w = w, t.h = b, u();
    },
    { passive: !1 }
  ), e.addEventListener("mousedown", (n) => {
    (n.button === 0 || n.button === 1) && (p(), a = !0, c = n.clientX, d = n.clientY, e.style.cursor = "grabbing", n.preventDefault());
  }), window.addEventListener("mousemove", (n) => {
    if (!a) return;
    const m = n.clientX - c, o = n.clientY - d;
    c = n.clientX, d = n.clientY;
    const r = e.getBoundingClientRect();
    t.x -= m * (t.w / r.width), t.y -= o * (t.h / r.height), u();
  }), window.addEventListener("mouseup", () => {
    a && (a = !1, e.style.cursor = "grab");
  }), e.addEventListener("dblclick", (n) => {
    const m = n.target.closest(".node");
    if (!m) return;
    const o = m.getBoundingClientRect(), r = e.getBoundingClientRect(), f = t.x + (o.left + o.width / 2 - r.left) / r.width * t.w, w = t.y + (o.top + o.height / 2 - r.top) / r.height * t.h, b = o.width / r.width * t.w, A = o.height / r.height * t.h, x = Math.max(b, A) / 0.2, Y = x * (r.height / r.width);
    h({
      x: f - x / 2,
      y: w - Y / 2,
      w: x,
      h: Y
    });
  });
  let y = 0;
  e.addEventListener(
    "touchstart",
    (n) => {
      if (p(), n.touches.length === 1)
        a = !0, c = n.touches[0].clientX, d = n.touches[0].clientY;
      else if (n.touches.length === 2) {
        a = !1;
        const m = n.touches[1].clientX - n.touches[0].clientX, o = n.touches[1].clientY - n.touches[0].clientY;
        y = Math.sqrt(m * m + o * o);
      }
      n.preventDefault();
    },
    { passive: !1 }
  ), e.addEventListener(
    "touchmove",
    (n) => {
      if (n.touches.length === 1 && a) {
        const m = n.touches[0].clientX - c, o = n.touches[0].clientY - d;
        c = n.touches[0].clientX, d = n.touches[0].clientY;
        const r = e.getBoundingClientRect();
        t.x -= m * (t.w / r.width), t.y -= o * (t.h / r.height), u();
      } else if (n.touches.length === 2) {
        const m = n.touches[1].clientX - n.touches[0].clientX, o = n.touches[1].clientY - n.touches[0].clientY, r = Math.sqrt(m * m + o * o), f = y / r, w = e.getBoundingClientRect(), b = ((n.touches[0].clientX + n.touches[1].clientX) / 2 - w.left) / w.width, A = ((n.touches[0].clientY + n.touches[1].clientY) / 2 - w.top) / w.height, E = t.w * f, x = t.h * f;
        t.x -= (E - t.w) * b, t.y -= (x - t.h) * A, t.w = E, t.h = x, y = r, u();
      }
      n.preventDefault();
    },
    { passive: !1 }
  ), e.addEventListener("touchend", () => {
    a = !1;
  }), e.style.cursor = "grab";
}
const O = `
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
function T() {
  if (document.getElementById("mermaid-3d-styles")) return;
  const e = document.createElement("style");
  e.id = "mermaid-3d-styles", e.textContent = O, document.head.appendChild(e);
}
function H(e) {
  const s = document.createElement("div");
  return s.id = e, s.className = "mermaid-3d-container", s.style.position = "absolute", s.style.inset = "0", s;
}
const q = {
  initialize(e = {}) {
    S = { ...S, ...e }, C = null;
  },
  async render(e, s, i) {
    T();
    const t = await N(), a = `mermaid3d-render-${L++}`, { svg: c } = await t.render(a, s), d = H(e);
    d.innerHTML = c, i && i.appendChild(d);
    const l = d.querySelector("svg");
    return l && (l.removeAttribute("width"), l.removeAttribute("height"), l.style.maxWidth = "none", S.shadows !== !1 && R(l), B(l), k(d, l)), {
      svg: c,
      element: d,
      bindFunctions: (u) => {
      }
    };
  },
  async run(e) {
    var t;
    const s = (e == null ? void 0 : e.querySelector) || "pre.mermaid, div.mermaid, .mermaid", i = e != null && e.nodes ? Array.from(e.nodes) : Array.from(document.querySelectorAll(s));
    for (let a = 0; a < i.length; a++) {
      const c = i[a], d = (t = c.textContent) == null ? void 0 : t.trim();
      if (!d) continue;
      const l = c.id || `mermaid-3d-${a}`;
      try {
        const u = await this.render(l, d), p = c.parentNode;
        p && (u.element.id = l, p.replaceChild(u.element, c)), e != null && e.postRenderCallback && e.postRenderCallback(l);
      } catch (u) {
        e != null && e.suppressErrors || console.error(`mermaid-3d: Failed to render diagram ${l}:`, u);
      }
    }
  },
  async parse(e, s) {
    const t = await (await N()).parse(e);
    return { diagramType: (t == null ? void 0 : t.diagramType) || "unknown" };
  },
  async registerExternalDiagrams(e) {
    const s = await N();
    typeof s.registerExternalDiagrams == "function" && await s.registerExternalDiagrams(
      e
    );
  },
  setParseErrorHandler(e) {
    S.__parseErrorHandler = e;
  },
  mermaidAPI: {
    initialize(e) {
      q.initialize(e);
    },
    async render(e, s, i) {
      return q.render(e, s, i);
    },
    async parse(e) {
      return q.parse(e);
    }
  }
};
export {
  q as default,
  q as mermaid3d
};
