export interface DiagramData {
  type: string;
  nodes: NodeData[];
  edges: EdgeData[];
  subgraphs?: SubgraphData[];
  metadata: Record<string, unknown>;
}

export interface NodeData {
  id: string;
  label: string;
  shape: string;
  position?: { x: number; y: number; z: number };
  style?: Record<string, string>;
  classes?: string[];
  link?: { url: string; target: string };
  callback?: string;
  width?: number;
  height?: number;
}

export interface EdgeData {
  source: string;
  target: string;
  label?: string;
  type: EdgeType;
  arrowHead?: ArrowHeadType;
  style?: Record<string, string>;
}

export type EdgeType = 'arrow' | 'open' | 'dotted' | 'thick' | 'invisible';
export type ArrowHeadType = 'normal' | 'circle' | 'cross' | 'none';

export interface SubgraphData {
  id: string;
  label: string;
  nodeIds: string[];
  style?: Record<string, string>;
}

export interface MermaidConfig {
  theme?: 'default' | 'dark' | 'forest' | 'neutral' | 'base';
  themeVariables?: Record<string, string>;
  startOnLoad?: boolean;
  securityLevel?: 'strict' | 'loose' | 'antiscript' | 'sandbox';
  logLevel?: number;
  shadows?: boolean;
  flowchart?: Record<string, unknown>;
  sequence?: Record<string, unknown>;
  gantt?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface RenderResult {
  svg: string;
  element: HTMLDivElement;
  bindFunctions?: (element: Element) => void;
  /** Call after inserting `element` into the DOM to apply isometric transform + pan/zoom.
   *  Automatically called if `containerElement` was passed to `render()`. */
  finalize: () => void;
}

export interface RunOptions {
  querySelector?: string;
  nodes?: ArrayLike<HTMLElement>;
  postRenderCallback?: (id: string) => void;
  suppressErrors?: boolean;
}

export interface ParseResult {
  diagramType: string;
}

export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  primaryBorderColor: string;
  primaryTextColor: string;
  secondaryBorderColor: string;
  secondaryTextColor: string;
  tertiaryBorderColor: string;
  tertiaryTextColor: string;
  lineColor: string;
  textColor: string;
  mainBkg: string;
  background: string;
  nodeBorder: string;
  clusterBkg: string;
  clusterBorder: string;
  titleColor: string;
  edgeLabelBackground: string;
}
