export type DetailMetaItem = {
  label: string;
  value: string;
};

export type DetailFigure = {
  src: string;
  alt?: string;
  caption?: string;
  /** Short description under the figure (e.g. interaction feature) */
  body?: string;
  /** Relative display scale, e.g. 0.3 */
  scale?: number;
  /** Place consecutive row figures side-by-side, flush to column edges */
  row?: boolean;
  /** CSS invert filter for dark backgrounds */
  invert?: boolean;
  /** Render image in grayscale */
  grayscale?: boolean;
  /** Render as muted video; plays when scrolled into view */
  video?: boolean;
  /** Animated GIF; loads/plays only when scrolled into view */
  gif?: boolean;
  /** Show mute / unmute control on in-view videos */
  soundToggle?: boolean;
  /** Cover/hero fit: natural keeps original aspect (no crop); cover fills a fixed frame */
  fit?: "cover" | "natural";
  /** CSS aspect-ratio for a shared frame, e.g. "3 / 2" */
  aspect?: string;
  /** Optional poster image when `video` is true (cover hero) */
  poster?: string;
  /** Standalone HTML chart; rendered in an iframe without rounded clipping */
  embed?: boolean;
  /** Initial iframe height in px when `embed` is true */
  height?: number;
  /** Plot is a square of the column width; iframe height = width + chrome */
  squarePlot?: boolean;
  /** Extra px above a square plot (tabs / axis names). Default 76 */
  chrome?: number;
  /** Round the embed frame (e.g. lieflat paper card) */
  rounded?: boolean;
  /** iframe height follows the sibling left column (tabs + plot, not caption) */
  matchLeft?: boolean;
};

export type DetailTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
  /** Span the page width instead of a single column */
  wide?: boolean;
  /** Tighter cells so a wide table need not scroll sideways */
  compact?: boolean;
  /** Optional grouped header row above `headers` */
  groups?: { label: string; span: number }[];
};

export type DetailPrototype = {
  index: string;
  title: string;
  device?: string;
  based?: string;
  bullets?: string[];
  body?: string[];
  figures?: DetailFigure[];
};

export type DetailSection =
  | {
      type: "prose";
      title?: string;
      paragraphs: string[];
      /** Body weight; default bold to match case-study style */
      weight?: "bold" | "normal";
    }
  | { type: "meta"; items: DetailMetaItem[] }
  | {
      type: "figure";
      figures: DetailFigure[];
      fullWidth?: boolean;
      /** Equal-width columns for figures (e.g. 3 GIF demos) */
      columns?: 2 | 3;
    }
  | {
      type: "featureGrid";
      /** Desktop column count; default 3 */
      columns?: 2 | 3;
      items: {
        figure: DetailFigure;
        title?: string;
        body: string;
      }[];
    }
  | { type: "table"; table: DetailTable }
  | {
      type: "goals";
      highlight?: boolean;
      /** Optional section title above the list (same style as prose titles) */
      heading?: string;
      /** Short lead line directly above the first goal (no large gap) */
      lead?: string;
      /** Tighter divider spacing between items */
      compact?: boolean;
      /** Top and bottom rules on each item (e.g. paired research questions) */
      ruled?: boolean;
      /** Equal cards in a row instead of a stacked list */
      layout?: "cards";
      /** Push down to align with sibling prose body (skip matching title row) */
      offsetTitle?: boolean;
      items: { title: string; body: string; figure?: DetailFigure }[];
    }
  | { type: "prototype"; prototype: DetailPrototype }
  | { type: "part"; number: string; title: string; subtitle?: string }
  /** Explicit two-column block (e.g. Research Background) */
  | {
      type: "columns";
      /** Optional large section title above / in the left column */
      heading?: string;
      /** Vertical alignment between columns; default start */
      align?: "start" | "end" | "between";
      /** Per-row alignment when subgrid pairs left/right (e.g. figure bottoms) */
      rowAlign?: "start" | "end";
      /** Offset right column to align with prose body (skip matching title row) */
      offsetTitle?: boolean;
      left: DetailSection[];
      right: DetailSection[];
    };

export type DetailLeadParagraph =
  | string
  | {
      before?: string;
      link: { label: string; href: string };
      after?: string;
    }
  | {
      /** Quote / attribution block */
      text: string;
      /** Smaller, normal-weight; sits at bottom of lead column */
      muted?: true;
    };

export type ProjectDetail = {
  cover?: DetailFigure;
  /** Small label above the left title, e.g. "Case Study" */
  eyebrow?: string;
  /** Short left headline; falls back to project.title when omitted */
  headline?: string;
  /** Large right-column title, e.g. "Report 2026." */
  secondaryTitle?: string;
  /** Left meta rows (Client / Year / Industry style) */
  meta?: DetailMetaItem[];
  /** Right meta row(s) aligned with the left meta column */
  services?: DetailMetaItem | DetailMetaItem[];
  lead: DetailLeadParagraph[];
  sections: DetailSection[];
  closing?: string;
};
