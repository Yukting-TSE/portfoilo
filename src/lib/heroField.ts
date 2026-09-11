/**
 * Generative field after Roni Kaufman
 * https://ronikaufman.github.io
 *
 * Dot waves stay screen-centered; only rotating tiles follow the pointer.
 */

const N_FRAMES = 500; // original 150 → 0.3× rotation / wave speed
const CYCLE_MS = (N_FRAMES / 60) * 1000; // time-based so motion never freezes
const TAU = Math.PI * 2;
const OFFSETS = [
  Math.PI / 3,
  (2 * Math.PI) / 3,
  Math.PI,
  (4 * Math.PI) / 3,
  (5 * Math.PI) / 3,
  TAU,
];

const DOT_COLOR = "#fffcf2";
/** High-saturation sky blue */
const RAY_COLOR = "#5EEDFF";
const FOLLOW_MS = 190;
/** Dots per tile cell edge (original sketch = 2). */
const DOTS_PER_CELL = 4;
const GRID_AXIS = 36;
/** Soft ease-in-out for pointer ray focus — still eased, but snappier */
const EASE_BEZIER = cubicBezier(0.33, 0.0, 0.2, 1);
/** Ray band width — higher = more blue tiles (original sketch ~0.005). */
const RAY_THRESHOLD = 0.008;

type RectTile = {
  i: number;
  j: number;
  si: number;
  sj: number;
  noRay?: boolean;
  neighbors: RectTile[];
  offset: number;
};

type Spot = {
  x: number;
  y: number;
  offset: number;
  distToCenter: number;
  /** Tile origin for ray focus exclusion */
  col: number;
  row: number;
  si: number;
  sj: number;
  noRay: boolean;
};

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const ax = 1 - 3 * x2 + 3 * x1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;
  const ay = 1 - 3 * y2 + 3 * y1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const s = slopeX(t);
      if (Math.abs(s) < 1e-6) break;
      t -= (sampleX(t) - x) / s;
      if (t < 0 || t > 1) {
        t = Math.min(1, Math.max(0, t));
        break;
      }
    }
    return sampleY(t);
  };
}

function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a) + a);
}

function shuffleInPlace<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = items[i];
    const swap = items[j];
    if (current === undefined || swap === undefined) continue;
    items[i] = swap;
    items[j] = current;
  }
  return items;
}

function rectanglesIntersect(a: RectTile, b: RectTile) {
  return (
    ((a.i <= b.i && a.i + a.si > b.i) || (b.i <= a.i && b.i + b.si > a.i)) &&
    ((a.j <= b.j && a.j + a.sj > b.j) || (b.j <= a.j && b.j + b.sj > a.j))
  );
}

function rectanglesTouch(a: RectTile, b: RectTile) {
  if (
    ((a.i <= b.i && a.i + a.si === b.i) ||
      (b.i <= a.i && b.i + b.si === a.i)) &&
    ((a.j <= b.j && a.j + a.sj > b.j) || (b.j <= a.j && b.j + b.sj > a.j))
  ) {
    return true;
  }
  if (
    ((a.i <= b.i && a.i + a.si > b.i) ||
      (b.i <= a.i && b.i + b.si > a.i)) &&
    ((a.j <= b.j && a.j + a.sj === b.j) ||
      (b.j <= a.j && b.j + b.sj === a.j))
  ) {
    return true;
  }
  return false;
}

function generateRectangle(
  tiles: RectTile[],
  cols: number,
  rows: number,
  maxSize: number,
): RectTile {
  const i = randInt(0, cols);
  const j = randInt(0, rows);

  let s = 0;
  let intersects = false;
  while (!intersects) {
    s += 1;
    const candidate = { i, j, si: s, sj: s, neighbors: [], offset: 0 };
    for (const tile of tiles) {
      if (
        i + s > cols ||
        j + s > rows ||
        s > maxSize ||
        rectanglesIntersect(candidate, tile)
      ) {
        intersects = true;
        break;
      }
    }
  }
  s -= 1;

  return { i, j, si: s, sj: s, neighbors: [], offset: 0 };
}

function elementsUsedByNeighbors(tile: RectTile) {
  const used: number[] = [];
  for (const neigh of tile.neighbors) {
    if (neigh.offset) used.push(neigh.offset);
  }
  return [...new Set(used)];
}

function largestUncoloredNeighborDegree(tile: RectTile) {
  let largest = -1;
  for (const neigh of tile.neighbors) {
    if (!neigh.offset) {
      const sat = elementsUsedByNeighbors(neigh).length;
      if (sat > largest) largest = sat;
    }
  }
  return largest;
}

function colorOffsets(tiles: RectTile[]) {
  const palette = [...OFFSETS];
  for (let n = 0; n < tiles.length; n += 1) {
    let pick: RectTile | undefined;
    let pickSat = -1;
    let pickUsed: number[] = [];

    for (const tile of tiles) {
      if (tile.offset) continue;
      const used = elementsUsedByNeighbors(tile);
      const sat = used.length;
      if (
        sat > pickSat ||
        (sat === pickSat &&
          pick &&
          largestUncoloredNeighborDegree(tile) >
            largestUncoloredNeighborDegree(pick))
      ) {
        pick = tile;
        pickSat = sat;
        pickUsed = used;
      }
    }

    if (!pick) break;
    shuffleInPlace(palette);
    const next = palette.find((value) => !pickUsed.includes(value));
    pick.offset = next ?? OFFSETS[n % OFFSETS.length] ?? Math.PI;
  }
}

function buildComposition(cols: number, rows: number) {
  const maxSize = Math.max(4, Math.floor(Math.min(cols, rows) / 5));
  const tiles: RectTile[] = [];

  const centerSize = 2 * randInt(2, Math.max(3, maxSize / 2));
  const ci = Math.max(
    0,
    Math.min(cols - centerSize, Math.floor(cols / 2 - centerSize / 2)),
  );
  const cj = Math.max(
    0,
    Math.min(rows - centerSize, Math.floor(rows / 2 - centerSize / 2)),
  );
  tiles.push({
    i: ci,
    j: cj,
    si: centerSize,
    sj: centerSize,
    noRay: true,
    neighbors: [],
    offset: 0,
  });

  for (let n = 0; n < 500; n += 1) {
    const next = generateRectangle(tiles, cols, rows, maxSize);
    if (next.si > 1 || next.sj > 1) tiles.push(next);
  }

  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      const gap: RectTile = {
        i,
        j,
        si: 1,
        sj: 1,
        neighbors: [],
        offset: 0,
      };
      let canAdd = true;
      for (const tile of tiles) {
        if (rectanglesIntersect(gap, tile)) {
          canAdd = false;
          break;
        }
      }
      if (canAdd) tiles.push(gap);
    }
  }

  for (let i = 0; i < tiles.length; i += 1) {
    const a = tiles[i];
    if (!a) continue;
    for (let j = 0; j < tiles.length; j += 1) {
      const b = tiles[j];
      if (!b || i === j) continue;
      if (rectanglesTouch(a, b)) a.neighbors.push(b);
    }
  }

  colorOffsets(tiles);
  return tiles;
}

function tileContainsSpot(sp: Spot, focusCol: number, focusRow: number) {
  return (
    focusCol >= sp.col &&
    focusCol < sp.col + sp.si &&
    focusRow >= sp.row &&
    focusRow < sp.row + sp.sj
  );
}

export class HeroFieldEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private spots: Spot[] = [];
  private raySpots: Spot[] = [];
  private cell = 16;
  private halfCell = 8;
  private cols = 40;
  private rows = 40;
  private cssWidth = 0;
  private cssHeight = 0;
  /** Grid origin — centers the field when cols/rows don't divide the viewport evenly */
  private originX = 0;
  private originY = 0;
  /** Pointer-driven origin for rotating tiles only */
  private focusX = 0;
  private focusY = 0;
  private fromX = 0;
  private fromY = 0;
  private toX = 0;
  private toY = 0;
  private elapsedMs = FOLLOW_MS;
  private lastTs = 0;
  private raf = 0;
  private running = false;
  private animating = false;
  private visible = true;
  private firstFrame = true;
  /** 1 = full size in hero; shrinks while scrolling through About */
  private sizeScale = 1;
  private fieldOpacity = 1;
  private rayAmount = 1;
  private targetSize = 1;
  private targetOpacity = 1;
  private targetRays = 1;
  private onFirstFrame: (() => void) | undefined;
  private resizeTimer = 0;

  constructor(canvas: HTMLCanvasElement, onFirstFrame?: () => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true });
    this.onFirstFrame = onFirstFrame;
  }

  start() {
    this.running = true;
    this.resize();
    this.startLoop();
  }

  destroy() {
    this.running = false;
    this.animating = false;
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.resizeTimer);
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (!visible && this.ctx) {
      this.sizeScale = 0;
      this.fieldOpacity = 0;
      this.rayAmount = 0;
      this.targetSize = 0;
      this.targetOpacity = 0;
      this.targetRays = 0;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.animating = false;
      cancelAnimationFrame(this.raf);
      return;
    }
    if (visible) this.startLoop();
  }

  /** Scroll-linked: size / opacity / blue-ray amount (smoothed in draw). */
  setScrollBlend(sizeScale: number, opacity: number, rayAmount = 1) {
    this.targetSize = Math.min(1, Math.max(0, sizeScale));
    this.targetOpacity = Math.min(1, Math.max(0, opacity));
    this.targetRays = Math.min(1, Math.max(0, rayAmount));
    // Keep the loop alive while fading out — never cut mid-lerp
    if (
      this.targetSize > 0.001 ||
      this.targetOpacity > 0.001 ||
      this.sizeScale > 0.01 ||
      this.fieldOpacity > 0.01
    ) {
      if (!this.animating && this.running && this.visible) this.startLoop();
    }
  }

  /** True once targets and smoothed values are effectively gone. */
  isFullyFaded() {
    return (
      this.targetSize <= 0.001 &&
      this.targetOpacity <= 0.001 &&
      this.sizeScale < 0.012 &&
      this.fieldOpacity < 0.012
    );
  }

  setPointer(x: number, y: number, inside: boolean) {
    const nextX = inside ? x : this.cssWidth / 2;
    const nextY = inside ? y : this.cssHeight / 2;
    this.retarget(nextX, nextY);
  }

  scheduleResize() {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => this.resize(), 80);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    if (
      width === this.cssWidth &&
      height === this.cssHeight &&
      this.spots.length
    ) {
      return;
    }

    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.cssWidth = width;
    this.cssHeight = height;
    if (width >= height) {
      this.cols = GRID_AXIS;
      this.cell = width / this.cols;
      this.rows = Math.max(10, Math.ceil(height / this.cell));
    } else {
      this.rows = GRID_AXIS;
      this.cell = height / this.rows;
      this.cols = Math.max(10, Math.ceil(width / this.cell));
    }
    this.halfCell = this.cell / 2;
    // Center the packed grid so leftover cell width doesn't push mass to one side
    this.originX = (width - this.cols * this.cell) / 2;
    this.originY = (height - this.rows * this.cell) / 2;
    this.focusX = width / 2;
    this.focusY = height / 2;
    this.fromX = this.focusX;
    this.fromY = this.focusY;
    this.toX = this.focusX;
    this.toY = this.focusY;
    this.elapsedMs = FOLLOW_MS;
    this.rebuild();
  }

  private retarget(x: number, y: number) {
    if (Math.hypot(x - this.toX, y - this.toY) < 0.5) return;

    const t = Math.min(1, this.elapsedMs / FOLLOW_MS);
    const e = EASE_BEZIER(t);
    if (e > 0.02 && e < 0.97) {
      const denom = 1 - e;
      this.fromX = (this.focusX - e * x) / denom;
      this.fromY = (this.focusY - e * y) / denom;
      this.toX = x;
      this.toY = y;
      return;
    }

    this.fromX = this.focusX;
    this.fromY = this.focusY;
    this.toX = x;
    this.toY = y;
    this.elapsedMs = 0;
  }

  private rebuild() {
    const tiles = buildComposition(this.cols, this.rows);
    this.spots = [];
    this.raySpots = [];
    const u = this.cell;
    const v = this.halfCell;
    const gap = u / DOTS_PER_CELL;
    const cx = this.cssWidth / 2;
    const cy = this.cssHeight / 2;
    const ox = this.originX;
    const oy = this.originY;

    for (const tile of tiles) {
      const x0 = ox + tile.i * u;
      const y0 = oy + tile.j * u;
      const stepsI = tile.si * DOTS_PER_CELL;
      const stepsJ = tile.sj * DOTS_PER_CELL;
      for (let ix = 0; ix < stepsI; ix += 1) {
        for (let iy = 0; iy < stepsJ; iy += 1) {
          const x = x0 + gap / 2 + ix * gap;
          const y = y0 + gap / 2 + iy * gap;
          this.spots.push({
            x,
            y,
            offset: tile.offset,
            distToCenter: Math.hypot(x - cx, y - cy),
            col: tile.i,
            row: tile.j,
            si: tile.si,
            sj: tile.sj,
            noRay: Boolean(tile.noRay),
          });
        }
      }

      const rayStepsI = tile.si * 2;
      const rayStepsJ = tile.sj * 2;
      for (let ix = 0; ix < rayStepsI; ix += 1) {
        for (let iy = 0; iy < rayStepsJ; iy += 1) {
          const x = x0 + v / 2 + ix * v;
          const y = y0 + v / 2 + iy * v;
          this.raySpots.push({
            x,
            y,
            offset: tile.offset,
            distToCenter: 0,
            col: tile.i,
            row: tile.j,
            si: tile.si,
            sj: tile.sj,
            noRay: Boolean(tile.noRay),
          });
        }
      }
    }
  }

  private startLoop() {
    if (!this.running || this.animating || !this.visible) return;
    this.animating = true;
    this.lastTs = 0;
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (ts: number) => {
    if (!this.running || !this.visible || document.hidden) {
      this.animating = false;
      this.lastTs = ts;
      return;
    }
    this.raf = requestAnimationFrame(this.tick);
    const dt = this.lastTs ? Math.min(32, ts - this.lastTs) : 16;
    this.lastTs = ts;
    this.draw(dt);
  };

  private draw(dt: number) {
    const ctx = this.ctx;
    if (!ctx || !this.cssWidth) return;

    // Exit is time-led so a short Hero→About gap still dissolves over ~1s
    const sizeDown = this.targetSize < this.sizeScale;
    const opacityDown = this.targetOpacity < this.fieldOpacity;
    const sizeBlend = 1 - Math.exp(-dt * (sizeDown ? 0.00155 : 0.005));
    const opacityBlend = 1 - Math.exp(-dt * (opacityDown ? 0.0017 : 0.0055));
    const rayDown = this.targetRays < this.rayAmount;
    const rayBlend = 1 - Math.exp(-dt * (rayDown ? 0.04 : 0.014));
    this.sizeScale += (this.targetSize - this.sizeScale) * sizeBlend;
    this.fieldOpacity += (this.targetOpacity - this.fieldOpacity) * opacityBlend;
    this.rayAmount += (this.targetRays - this.rayAmount) * rayBlend;

    this.elapsedMs = Math.min(FOLLOW_MS, this.elapsedMs + dt);
    const e = EASE_BEZIER(this.elapsedMs / FOLLOW_MS);
    this.focusX = this.fromX + (this.toX - this.fromX) * e;
    this.focusY = this.fromY + (this.toY - this.fromY) * e;

    const t = (TAU * (performance.now() % CYCLE_MS)) / CYCLE_MS;
    const v = this.halfCell;
    const density = 30;
    const focusCol = (this.focusX - this.originX) / this.cell;
    const focusRow = (this.focusY - this.originY) / this.cell;
    const sizeScale = this.sizeScale;
    const alpha = this.fieldOpacity;
    const rays = this.rayAmount;

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);

    if (alpha < 0.01 || sizeScale < 0.01) {
      if (this.firstFrame) {
        this.firstFrame = false;
        this.onFirstFrame?.();
      }
      // Pause once the dissolve has finished — no hard cut mid-lerp
      if (
        this.targetSize <= 0.001 &&
        this.targetOpacity <= 0.001 &&
        this.sizeScale < 0.012 &&
        this.fieldOpacity < 0.012
      ) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const dpr = Math.min(1.5, window.devicePixelRatio || 1);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.animating = false;
        cancelAnimationFrame(this.raf);
      }
      return;
    }

    ctx.globalAlpha = alpha;
    const topBand = Math.max(96, this.cssHeight * 0.16);
    // Desktop only: gentle left quieting (keep field visually centered)
    const narrow = this.cssWidth < 768;
    const copyFadeX = narrow ? 0 : this.cssWidth * 0.28;
    const sizeBase = v * 0.36 * sizeScale;

    ctx.fillStyle = DOT_COLOR;
    ctx.beginPath();
    for (let i = 0; i < this.spots.length; i += 1) {
      const sp = this.spots[i]!;
      const dVal =
        (Math.sin(sp.distToCenter / density - t + sp.offset) + 1) / 2;
      let topScale = 1;
      if (sp.y < topBand) {
        topScale = 0.12 + 0.88 * Math.pow(sp.y / topBand, 1.35);
      }
      let copyScale = 1;
      if (copyFadeX > 0 && sp.x < copyFadeX) {
        copyScale = 0.45 + 0.55 * Math.pow(sp.x / copyFadeX, 1.1);
      }
      const d = (dVal * 0.6 + 0.2) * sizeBase * topScale * copyScale;
      if (d < 0.22) continue;
      const r = d / 2;
      ctx.moveTo(sp.x + r, sp.y);
      ctx.arc(sp.x, sp.y, r, 0, TAU);
    }
    ctx.fill();

    if (rays > 0.04 && sizeScale > 0.12) {
      ctx.globalAlpha = alpha * rays;
      ctx.fillStyle = RAY_COLOR;
      ctx.imageSmoothingEnabled = false;
      // Inflate by 1–2px so floor/ceil seams don't show as black hairlines
      const unit = v * sizeScale;
      const raySize = Math.max(2, Math.ceil(unit) + 2);
      const rayLeftSkip = narrow ? 0 : this.cssWidth * 0.2;
      for (let i = 0; i < this.raySpots.length; i += 1) {
        const sp = this.raySpots[i]!;
        if (sp.y < topBand * 0.85 || sp.noRay) continue;
        if (sp.x < rayLeftSkip) continue;
        if (tileContainsSpot(sp, focusCol, focusRow)) continue;
        const theta = Math.atan2(sp.y - this.focusY, sp.x - this.focusX);
        const colVal = (Math.sin(2 * theta - t + sp.offset) + 1) / 2;
        if (colVal >= RAY_THRESHOLD) continue;
        ctx.fillRect(
          Math.round(sp.x - unit / 2) - 1,
          Math.round(sp.y - unit / 2) - 1,
          raySize,
          raySize,
        );
      }
      ctx.imageSmoothingEnabled = true;
    }
    ctx.globalAlpha = 1;

    if (this.firstFrame) {
      this.firstFrame = false;
      this.onFirstFrame?.();
    }
  }
}
