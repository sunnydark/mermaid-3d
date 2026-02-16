# mermaid-3d

Drop-in replacement for [Mermaid.js](https://mermaid.js.org/) that renders any diagram in an **isometric 3D style** — floating shadows, vector-crisp zoom, pan, and fly-to animations. Swap one import and your flat diagrams become isometric.

![mermaid-3d demo](https://raw.githubusercontent.com/SunnyDark/mermaid-3d/master/assets/demo.png)

## Features

- **Isometric projection** — orthographic 45° rotation applied as an SVG matrix transform (no CSS 3D, no rasterization)
- **Floating shadows** — configurable drop shadows on nodes, actors, tasks, commits, pie slices, and more
- **Vector zoom** — viewBox-based zoom keeps the SVG sharp at any magnification
- **Pan & zoom** — mouse drag to pan, scroll wheel to zoom, touch support for mobile
- **Fly-to** — double-click any node to smoothly animate the viewport to it
- **All diagram types** — flowchart, sequence, class, state, ER, gantt, pie, git graph, mindmap, timeline, journey
- **Theme support** — all five Mermaid themes (default, dark, forest, neutral, base)
- **Drop-in API** — same `initialize()`, `render()`, `run()`, and `parse()` methods as Mermaid
- **Tiny** — ~10 KB bundled (ESM + UMD), zero runtime dependencies

## Install

```bash
npm install mermaid-3d mermaid
```

`mermaid` is a peer dependency (>= 10.0.0). You must install it alongside `mermaid-3d`.

## Quick Start

### Replace your Mermaid import

```diff
- import mermaid from 'mermaid';
+ import mermaid from 'mermaid-3d';
```

Everything else stays the same — `initialize()`, `render()`, and `run()` work identically.

### Render to a container

```js
import mermaid from 'mermaid-3d';

mermaid.initialize({ theme: 'default', shadows: true });

const container = document.getElementById('diagram');
await mermaid.render('my-diagram', `
  flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
`, container);
```

### Auto-render `<pre class="mermaid">` blocks

```js
import mermaid from 'mermaid-3d';

mermaid.initialize({ theme: 'default' });
await mermaid.run();
```

```html
<pre class="mermaid">
  sequenceDiagram
    Alice->>Bob: Hello
    Bob-->>Alice: Hi back
</pre>
```

## API

### `mermaid.initialize(config)`

Configure the renderer. Accepts all standard [Mermaid configuration options](https://mermaid.js.org/config/schema-docs/config.html) plus:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `shadows` | `boolean` | `true` | Enable floating drop shadows on diagram elements |
| `theme` | `string` | `'default'` | Mermaid theme: `'default'`, `'dark'`, `'forest'`, `'neutral'`, `'base'` |

```js
mermaid.initialize({
  theme: 'dark',
  shadows: true,
  securityLevel: 'loose',
});
```

### `mermaid.render(id, text, container?)`

Render a diagram from Mermaid markup.

- **`id`** — unique identifier for this diagram
- **`text`** — Mermaid diagram source text
- **`container`** *(optional)* — DOM element to append the rendered diagram to

Returns `Promise<{ svg: string, element: HTMLDivElement, bindFunctions: Function }>`.

```js
const { svg, element } = await mermaid.render('demo', 'graph TD; A-->B;');
document.body.appendChild(element);
```

### `mermaid.run(options?)`

Find and render all Mermaid blocks in the page.

| Option | Type | Description |
|--------|------|-------------|
| `querySelector` | `string` | CSS selector for elements to render (default: `'pre.mermaid, div.mermaid, .mermaid'`) |
| `nodes` | `ArrayLike<HTMLElement>` | Explicit list of elements to render |
| `postRenderCallback` | `(id: string) => void` | Called after each diagram renders |
| `suppressErrors` | `boolean` | Suppress console error output |

### `mermaid.parse(text)`

Parse Mermaid text without rendering. Returns `Promise<{ diagramType: string }>`.

```js
const { diagramType } = await mermaid.parse('graph TD; A-->B;');
console.log(diagramType); // 'flowchart'
```

## Interactions

| Action | Effect |
|--------|--------|
| **Scroll wheel** | Zoom in/out towards cursor |
| **Click + drag** | Pan the viewport |
| **Double-click a node** | Fly-to: smooth zoom animation centering on the node |
| **Pinch** (touch) | Two-finger zoom |
| **Drag** (touch) | One-finger pan |

## Supported Diagrams

All Mermaid diagram types render in isometric 3D:

| | |
|:---:|:---:|
| **Flowchart** | **Sequence Diagram** |
| ![Flowchart](https://raw.githubusercontent.com/SunnyDark/mermaid-3d/master/assets/flowchart.png) | ![Sequence](https://raw.githubusercontent.com/SunnyDark/mermaid-3d/master/assets/sequence.png) |
| **Class Diagram** | **State Diagram** |
| ![Class](https://raw.githubusercontent.com/SunnyDark/mermaid-3d/master/assets/class.png) | ![State](https://raw.githubusercontent.com/SunnyDark/mermaid-3d/master/assets/state.png) |
| **Entity Relationship** | **Gantt Chart** |
| ![ER](https://raw.githubusercontent.com/SunnyDark/mermaid-3d/master/assets/er.png) | ![Gantt](https://raw.githubusercontent.com/SunnyDark/mermaid-3d/master/assets/gantt.png) |
| **Pie Chart** | **Git Graph** |
| ![Pie](https://raw.githubusercontent.com/SunnyDark/mermaid-3d/master/assets/pie.png) | ![Git Graph](https://raw.githubusercontent.com/SunnyDark/mermaid-3d/master/assets/gitgraph.png) |
| **Mindmap** | **Timeline** |
| ![Mindmap](https://raw.githubusercontent.com/SunnyDark/mermaid-3d/master/assets/mindmap.png) | ![Timeline](https://raw.githubusercontent.com/SunnyDark/mermaid-3d/master/assets/timeline.png) |
| **User Journey** | |
| ![Journey](https://raw.githubusercontent.com/SunnyDark/mermaid-3d/master/assets/journey.png) | |

## How It Works

1. **Parse & render** — Mermaid generates a standard SVG diagram
2. **Shadow filter** — An SVG `<filter>` (offset + gaussian blur + flood composite) is injected and applied to diagram-specific elements (`.node` groups, actor rects, task bars, pie slices, commit circles, etc.)
3. **Isometric transform** — All SVG content is wrapped in a `<g transform="matrix(0.707 -0.5 0.707 0.5 0 0)">` — the 2D orthographic projection of a 45° isometric rotation. No CSS 3D transforms, so the SVG stays vector at all zoom levels
4. **ViewBox zoom** — Pan and zoom manipulate the SVG `viewBox` attribute directly, so the browser re-rasterizes at native resolution on every frame

## Development

```bash
git clone https://github.com/SunnyDark/mermaid-3d.git
cd mermaid-3d
npm install
npm run dev
```

Open `http://localhost:5174` to see the interactive demo with all diagram types.

### Build

```bash
npm run build
```

Produces `dist/mermaid-3d.es.js` (ESM) and `dist/mermaid-3d.umd.js` (UMD).

## CDN Usage

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mermaid-3d/dist/mermaid-3d.umd.js"></script>
<script>
  mermaid3d.default.initialize({ theme: 'default' });
  mermaid3d.default.run();
</script>
```

## License

[MIT](LICENSE)
