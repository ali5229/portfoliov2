"use client";

import { useEffect, useRef } from "react";
import { useMotionArmed } from "@/hooks/useMotionArmed";
import { CHIP_EXTENT, gridLayout, PITCH } from "@/lib/grid";

/* ---------- grid + packets ---------- */
const HERO_PACKETS = 7;
const STRAY_PACKETS = 3; // sparse packets over the rest of the page
const SPEED = 70; // px per second
const TRAIL = 40; // px
const POST_MS = 700; // "entry posted" ring
const COLUMN_ALPHA = 0.04; // grid under the content column
const GUTTER_ALPHA = 0.065; // grid in the side margins, where the chips live

/* ---------- side chips ----------
   Geometry in grid cells, relative to the chip body's top-left corner (the body is 1×4 cells).
   Written for the right chip; the left chip mirrors it (x → 1 − x). Everything sits on grid lines. */
type Cell = [number, number];
const BODY: Cell[] = [
  [0, 0],
  [1, 0],
  [1, 4],
  [0, 4],
  [0, 0],
];
const PINS: Cell[][] = [1, 2, 3].flatMap((y) => [
  [
    [0, y],
    [-1, y],
  ],
  [
    [1, y],
    [2, y],
  ],
]);
const MID_PADS: Cell[] = [
  [-1, 2],
  [2, 2],
];
// Each trace runs from its pad (first point) to a pin end (last point).
const TRACES: Cell[][] = [
  [
    [-1, 7],
    [-1, 3],
  ],
  [
    [2, -4],
    [2, 1],
  ],
  [
    [0, -6],
    [0, -2],
    [-1, -2],
    [-1, 1],
  ],
  [
    [1, 9],
    [1, 6],
    [2, 6],
    [2, 3],
  ],
];
const EXTENT = CHIP_EXTENT;
/* Build order: 0 pad A · 1 trace A · 2–4 traces B–D · 5 body · 6 pins · 7 power on.
   Stage 1 (hero) shows just element 0; the last section shows all 8. */
const ELEMENTS = 8;
const SECTIONS = [
  "[data-hero]",
  "#work",
  "#architecture",
  "#projects",
  "#experience",
  "#stack",
  "#contact",
];

type Pt = { x: number; y: number };
type Packet = {
  col: number;
  row: number;
  dx: number;
  dy: number;
  p: number;
  segs: number;
  trail: Pt[];
  hero: boolean;
};
type Post = { x: number; y: number; t0: number };
type Chip = { ax: number; ay: number; mirror: boolean } | null;

const rand = (n: number) => Math.floor(Math.random() * n);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

/** Fixed full-page ledger grid. Packets run along it (dense in the hero, sparse elsewhere), and in
 *  the side margins two circuit chips transform with scroll: the left one un-routes from complete
 *  to a single pad, the right one routes from a single pad to a powered chip at Contact. On mouse
 *  devices a trace follows the pointer along the grid and fades out behind it.
 *  Reduced motion / unarmed: static grid only. The loop pauses in hidden tabs. */
export function PageBackground() {
  const armed = useMotionArmed();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const grid = document.createElement("canvas");
    let w = 0;
    let h = 0;
    let cols = 0;
    let ox = 0; // horizontal grid offset: the grid is centred on the page so both gutters mirror
    let rows = 0;
    let colLeft = 0; // content column edges, px
    let colRight = 0;
    let ink = "";
    let accent = "";
    let raf = 0;
    let last = 0;
    let anchors: number[] = []; // scrollY at which each section's stage is reached
    let chips: [Chip, Chip] = [null, null];
    let build = 1; // smoothed right-chip progress, in elements (1 → ELEMENTS)
    let flow = 0; // seconds, drives data pulses on a powered chip
    const packets: Packet[] = [];
    const posts: Post[] = [];
    const hero = document.querySelector<HTMLElement>("[data-hero]");

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      ink = s.getPropertyValue("--ink").trim();
      accent = s.getPropertyValue("--accent").trim();
    };

    /* ----- layout ----- */
    const drawGrid = () => {
      grid.width = canvas.width;
      grid.height = canvas.height;
      const g = grid.getContext("2d");
      if (!g) return;
      const dpr = canvas.width / Math.max(1, w);
      const pass = (alpha: number) => {
        g.globalAlpha = alpha;
        g.beginPath();
        for (let c = 0; c <= cols; c++) {
          g.moveTo(ox + c * PITCH + 0.5, 0);
          g.lineTo(ox + c * PITCH + 0.5, h);
        }
        for (let r = 0; r <= rows; r++) {
          g.moveTo(0, r * PITCH + 0.5);
          g.lineTo(w, r * PITCH + 0.5);
        }
        g.stroke();
        g.globalAlpha = alpha * 2.4;
        for (let c = 0; c <= cols; c++)
          for (let r = 0; r <= rows; r++)
            g.fillRect(ox + c * PITCH - 0.5, r * PITCH - 0.5, 2, 2);
      };
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.strokeStyle = ink;
      g.fillStyle = ink;
      g.lineWidth = 1;
      pass(COLUMN_ALPHA);
      // second pass, clipped to the gutters, lifts them to roughly GUTTER_ALPHA
      g.save();
      g.beginPath();
      g.rect(0, 0, colLeft, h);
      g.rect(colRight, 0, w - colRight, h);
      g.clip();
      pass((GUTTER_ALPHA - COLUMN_ALPHA) / (1 - COLUMN_ALPHA));
      g.restore();
    };

    /* Centre the grid on the page (lines through the centre, or offset half a cell — whichever lets
       a chip sit inside the left gutter), then mirror that chip into the right gutter. Because the
       grid is symmetric about the centre, the mirrored chip lands on grid lines too. */
    const placeChips = () => {
      const header = 72;
      let ay = Math.round((h / 2 - 2 * PITCH) / PITCH) * PITCH; // body centre near screen centre
      ay = Math.max(
        ay,
        Math.ceil((header - EXTENT.minY * PITCH) / PITCH) * PITCH,
      );
      const layout = gridLayout(w, colLeft);
      ox = layout.ox;
      const ax = layout.chipAx;
      chips =
        ax === null
          ? [null, null] // gutters too narrow: grid only
          : [
              { ax, ay, mirror: true },
              { ax: w - ax - PITCH, ay, mirror: false },
            ];
    };

    const measure = () => {
      const wrap = document.querySelector<HTMLElement>("main .wrap");
      const r = wrap?.getBoundingClientRect();
      colLeft = r ? r.left : 0;
      colRight = r ? r.right : w;
      placeChips();
      cols = Math.floor((w - ox) / PITCH);

      const vh = window.innerHeight;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      anchors = SECTIONS.map((sel, i) => {
        if (i === 0) return 0;
        const el = document.querySelector<HTMLElement>(sel);
        const top = el
          ? el.getBoundingClientRect().top + window.scrollY
          : maxScroll;
        return Math.min(top - vh * 0.5, maxScroll);
      });
      for (let i = 1; i < anchors.length; i++)
        anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
    };

    // Section stage as a float (0 = hero … SECTIONS.length − 1 = contact), linear between anchors.
    const stageAt = (y: number) => {
      for (let i = 1; i < anchors.length; i++) {
        if (y <= anchors[i])
          return (
            i -
            1 +
            clamp01((y - anchors[i - 1]) / (anchors[i] - anchors[i - 1]))
          );
      }
      return anchors.length - 1;
    };
    const targetBuild = () =>
      1 + ((ELEMENTS - 1) * stageAt(window.scrollY)) / (SECTIONS.length - 1);

    /* ----- packets ----- */
    const heroRect = () => {
      const r = hero?.getBoundingClientRect();
      if (!r || r.bottom <= 0 || r.top >= h) return null;
      return {
        c0: Math.max(0, Math.ceil((r.left - ox) / PITCH)),
        c1: Math.min(cols, Math.floor((r.right - ox) / PITCH)),
        r0: Math.max(0, Math.ceil(r.top / PITCH)),
        r1: Math.min(rows, Math.floor(r.bottom / PITCH)),
      };
    };
    let heroBox: ReturnType<typeof heroRect> = null; // refreshed once per frame
    const bounds = (pk: Packet) =>
      pk.hero ? heroBox : { c0: 0, c1: cols, r0: 0, r1: rows };

    const spawn = (pk: Packet): Packet => {
      const b = bounds(pk) ?? { c0: 0, c1: cols, r0: 0, r1: rows };
      const [dx, dy] = DIRS[rand(4)];
      return Object.assign(pk, {
        col: b.c0 + rand(Math.max(1, b.c1 - b.c0 + 1)),
        row: b.r0 + rand(Math.max(1, b.r1 - b.r0 + 1)),
        dx,
        dy,
        p: Math.random() * PITCH,
        segs: 4 + rand(6),
        trail: [],
      });
    };

    const turn = (pk: Packet) => {
      const b = bounds(pk);
      if (!b) return;
      const ok = (c: number, r: number) =>
        c >= b.c0 && c <= b.c1 && r >= b.r0 && r <= b.r1;
      const options: [number, number][] = [
        [pk.dx, pk.dy],
        [pk.dx, pk.dy],
        [-pk.dy, pk.dx],
        [pk.dy, -pk.dx],
      ];
      const valid = options.filter(([dx, dy]) => ok(pk.col + dx, pk.row + dy));
      const [dx, dy] = valid.length
        ? valid[rand(valid.length)]
        : [-pk.dx, -pk.dy];
      pk.dx = dx;
      pk.dy = dy;
    };

    const stepPackets = (dt: number, now: number) => {
      for (const pk of packets) {
        const b = bounds(pk);
        if (!b) {
          pk.trail.length = 0; // hero scrolled away: park until it's back
          continue;
        }
        if (pk.col < b.c0 || pk.col > b.c1 || pk.row < b.r0 || pk.row > b.r1)
          spawn(pk); // region moved
        pk.p += SPEED * dt;
        while (pk.p >= PITCH) {
          pk.p -= PITCH;
          pk.col += pk.dx;
          pk.row += pk.dy;
          if (--pk.segs <= 0) {
            posts.push({
              x: ox + pk.col * PITCH + 0.5,
              y: pk.row * PITCH + 0.5,
              t0: now,
            });
            spawn(pk);
            break;
          }
          turn(pk);
        }
        pk.trail.push({
          x: ox + pk.col * PITCH + 0.5 + pk.dx * pk.p,
          y: pk.row * PITCH + 0.5 + pk.dy * pk.p,
        });
        let len = 0;
        for (let i = pk.trail.length - 1; i > 0; i--) {
          len +=
            Math.abs(pk.trail[i].x - pk.trail[i - 1].x) +
            Math.abs(pk.trail[i].y - pk.trail[i - 1].y);
          if (len > TRAIL) {
            pk.trail.splice(0, i);
            break;
          }
        }
      }
    };

    const drawPackets = (now: number) => {
      ctx.strokeStyle = accent;
      ctx.fillStyle = accent;
      for (let i = posts.length - 1; i >= 0; i--) {
        const k = (now - posts[i].t0) / POST_MS;
        if (k >= 1) {
          posts.splice(i, 1);
          continue;
        }
        const { x, y } = posts[i];
        ctx.globalAlpha = 0.07 * (1 - k);
        ctx.fillRect(x, y, PITCH, PITCH);
        ctx.globalAlpha = 0.5 * (1 - k);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 2 + 12 * k, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      for (const pk of packets) {
        const t = pk.trail;
        const strength = pk.hero ? 1 : 0.45;
        for (let i = 1; i < t.length; i++) {
          ctx.globalAlpha = (i / t.length) * 0.55 * strength;
          ctx.beginPath();
          ctx.moveTo(t[i - 1].x, t[i - 1].y);
          ctx.lineTo(t[i].x, t[i].y);
          ctx.stroke();
        }
        const head = t[t.length - 1];
        if (!head) continue;
        ctx.globalAlpha = 0.9 * strength;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    /* ----- chips ----- */
    const drawChip = (chip: Chip, progress: number) => {
      if (!chip) return;
      const X = (x: number) =>
        chip.ax + (chip.mirror ? 1 - x : x) * PITCH + 0.5;
      const Y = (y: number) => chip.ay + y * PITCH + 0.5;
      const part = (i: number) => clamp01(progress - i); // each element fills over one unit
      const power = part(7);

      // Draws the first `frac` of a cell polyline.
      const polyline = (pts: Cell[], frac: number) => {
        if (frac <= 0) return;
        const segs = pts
          .slice(1)
          .map(
            (p, i) => Math.abs(p[0] - pts[i][0]) + Math.abs(p[1] - pts[i][1]),
          );
        let left = frac * segs.reduce((a, b) => a + b, 0);
        ctx.beginPath();
        ctx.moveTo(X(pts[0][0]), Y(pts[0][1]));
        for (let i = 0; i < segs.length && left > 0; i++) {
          const k = Math.min(1, left / segs[i]);
          const [x0, y0] = pts[i];
          const [x1, y1] = pts[i + 1];
          ctx.lineTo(X(x0 + (x1 - x0) * k), Y(y0 + (y1 - y0) * k));
          left -= segs[i];
        }
        ctx.stroke();
      };
      const pad = (c: Cell, k: number) => {
        if (k <= 0) return;
        ctx.beginPath();
        ctx.arc(X(c[0]), Y(c[1]), 3.5 * Math.min(1, k * 1.6), 0, Math.PI * 2);
        ctx.fill();
      };

      ctx.lineCap = "square";
      ctx.lineJoin = "miter";
      ctx.lineWidth = 1.5;
      // copper: ink while unpowered, shading toward accent as the chip powers on
      const copper = (alpha: number) => {
        ctx.globalAlpha = alpha * (1 - power);
        return ink;
      };
      const lit = (alpha: number) => {
        ctx.globalAlpha = alpha * power;
        return accent;
      };
      const both = (draw: () => void, alpha: number) => {
        ctx.strokeStyle = ctx.fillStyle = copper(alpha);
        draw();
        if (power > 0) {
          ctx.strokeStyle = ctx.fillStyle = lit(alpha + 0.25);
          draw();
        }
      };

      // 0–4: pads, then traces routing in toward the chip
      both(() => {
        pad(TRACES[0][0], part(0));
        polyline(TRACES[0], part(1));
        for (let i = 1; i < TRACES.length; i++) {
          const k = part(i + 1);
          pad(TRACES[i][0], k * 5); // the pad pops in during the first fifth
          polyline(TRACES[i], (k - 0.2) / 0.8);
        }
      }, 0.38);

      // 5: body outline draws around its perimeter
      both(() => polyline(BODY, part(5)), 0.5);

      // 6: pins grow out of the body, mid pads appear
      both(() => {
        const k = part(6);
        for (const pin of PINS) polyline(pin, k);
        for (const c of MID_PADS) pad(c, (k - 0.6) / 0.4);
      }, 0.45);

      // 7: power on: die fills, notch, data pulses flow along every trace into the chip
      if (power > 0) {
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.18 * power;
        ctx.fillRect(X(chip.mirror ? 1 : 0), Y(0), PITCH, 4 * PITCH);
        ctx.globalAlpha = 0.7 * power;
        ctx.strokeStyle = accent;
        ctx.beginPath();
        ctx.arc(X(0.5), Y(0), 5, 0, Math.PI);
        ctx.stroke();
        for (let i = 0; i < TRACES.length; i++) {
          const pts = TRACES[i];
          const segs = pts
            .slice(1)
            .map(
              (p, j) => Math.abs(p[0] - pts[j][0]) + Math.abs(p[1] - pts[j][1]),
            );
          const total = segs.reduce((a, b) => a + b, 0);
          let d = (((flow * SPEED) / PITCH + i * 1.7) % (total + 2)) - 1; // cells along the trace
          if (d < 0 || d > total) continue;
          let j = 0;
          while (d > segs[j]) d -= segs[j++];
          const [x0, y0] = pts[j];
          const [x1, y1] = pts[j + 1];
          const k = d / segs[j];
          ctx.globalAlpha = 0.9 * power;
          ctx.beginPath();
          ctx.arc(
            X(x0 + (x1 - x0) * k),
            Y(y0 + (y1 - y0) * k),
            2.5,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
    };

    /* ----- cursor trail ----- */
    // As the mouse moves, a trace routes along the grid behind it (right-angle turns, like the chips'
    // traces) and fades out. The real cursor stays; this lives on the background, so it passes under
    // cards, dims over text, and disappears shortly after the mouse stops.
    type TrailPt = { x: number; y: number; t: number };
    const trailState = {
      on: false, // pointer inside the window
      quiet: 0, // 0..1 dimming over text
      quietTarget: false,
      head: null as Pt | null, // moving tip, px
      node: null as Pt | null, // last queued grid intersection
      queue: [] as Pt[], // intersections the tip still has to reach
      pts: [] as TrailPt[], // corners already passed, with the time they were passed
      moved: 0, // time of the last pointer move
    };
    const TRAIL_LIFE = 550; // ms a trail corner stays visible
    const TIP_SPEED = 1100; // px/s, plus catch-up when the queue grows
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

    const snap = (x: number, y: number): Pt => ({
      x: ox + Math.round((x - ox) / PITCH) * PITCH + 0.5,
      y: Math.round(y / PITCH) * PITCH + 0.5,
    });
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target instanceof Element ? e.target : null;
      trailState.quietTarget = !!t?.closest(
        "p, li, td, h1, h2, h3, h4, .label, .receipt",
      );
      trailState.on = true;
      trailState.moved = performance.now();
      const n = snap(e.clientX, e.clientY);
      const last = trailState.node;
      if (!last || !trailState.head) {
        trailState.head = { ...n };
        trailState.node = n;
        return;
      }
      if (n.x === last.x && n.y === last.y) return;
      // route along the grid: the longer leg first, then turn
      const corner =
        Math.abs(n.x - last.x) >= Math.abs(n.y - last.y)
          ? { x: n.x, y: last.y }
          : { x: last.x, y: n.y };
      if (corner.x !== n.x || corner.y !== n.y) trailState.queue.push(corner);
      trailState.queue.push(n);
      if (trailState.queue.length > 16)
        trailState.queue.splice(0, trailState.queue.length - 16);
      trailState.node = n;
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) trailState.on = false;
    };

    const stepCursor = (dt: number, now: number) => {
      const st = trailState;
      st.quiet +=
        ((st.quietTarget ? 1 : 0) - st.quiet) * (1 - Math.exp(-dt * 10));
      let budget = (TIP_SPEED + st.queue.length * 250) * dt;
      while (st.head && st.queue.length && budget > 0) {
        const to = st.queue[0];
        const d = Math.abs(to.x - st.head.x) + Math.abs(to.y - st.head.y);
        if (d <= budget) {
          budget -= d;
          st.head = { ...to };
          st.pts.push({ ...to, t: now });
          st.queue.shift();
        } else {
          // segments are axis-aligned, so move along whichever axis differs
          if (to.x !== st.head.x)
            st.head.x += Math.sign(to.x - st.head.x) * budget;
          else st.head.y += Math.sign(to.y - st.head.y) * budget;
          budget = 0;
        }
      }
      while (st.pts.length && now - st.pts[0].t > TRAIL_LIFE) st.pts.shift();
    };

    const drawCursor = (now: number) => {
      const st = trailState;
      if (!st.head) return;
      const dim = 1 - 0.6 * st.quiet;
      // tip fades once the mouse has been still for a moment, or has left the window
      const idle = now - st.moved;
      const tipAlpha =
        (st.on ? 1 : 0) * Math.max(0, 1 - Math.max(0, idle - 250) / 450) * dim;
      const path = [...st.pts, { ...st.head, t: now }];
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      for (let i = 1; i < path.length; i++) {
        const age = (now - path[i - 1].t) / TRAIL_LIFE;
        const alpha = Math.max(0, 1 - age) * 0.75 * dim;
        if (alpha <= 0.01) continue;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(path[i - 1].x, path[i - 1].y);
        ctx.lineTo(path[i].x, path[i].y);
        ctx.stroke();
      }
      if (tipAlpha > 0.01) {
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.18 * tipAlpha;
        ctx.beginPath();
        ctx.arc(st.head.x, st.head.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.9 * tipAlpha;
        ctx.beginPath();
        ctx.arc(st.head.x, st.head.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    /* ----- frame ----- */
    const paint = (now: number, animated: boolean) => {
      // A detached or not-yet-laid-out canvas measures 0×0, and drawImage throws on a 0-size source.
      if (!w || !h || !grid.width || !grid.height) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.drawImage(grid, 0, 0, w, h);
      if (!animated) return;
      drawPackets(now);
      drawChip(chips[0], ELEMENTS + 1 - build); // left: complete → single pad
      drawChip(chips[1], build); // right: single pad → powered
      if (fine) drawCursor(now);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop); // schedule first, so one bad frame can't stop the loop
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      heroBox = heroRect();
      stepPackets(dt, now);
      build += (targetBuild() - build) * (1 - Math.exp(-dt * 9)); // smooth scrub
      flow += dt;
      if (fine) stepCursor(dt, now);
      paint(now, true);
    };

    const update = () => {
      const run = armed && !document.hidden;
      if (run && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      rows = Math.floor(h / PITCH);
      measure();
      drawGrid();
      if (!raf) paint(performance.now(), false);
    };

    const recolor = () => {
      readColors();
      drawGrid();
      if (!raf) paint(performance.now(), false);
    };

    readColors();
    resize();
    build = targetBuild(); // start in the right state if the page loads mid-scroll
    heroBox = heroRect();
    if (armed) {
      for (let i = 0; i < HERO_PACKETS + STRAY_PACKETS; i++) {
        packets.push(spawn({ hero: i < HERO_PACKETS } as Packet));
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    ro.observe(document.body); // page height changes move the section anchors
    document.addEventListener("visibilitychange", update);
    if (fine && armed) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("mouseout", onLeave);
    }
    const scheme = matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", recolor);
    update();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("mouseout", onLeave);
      scheme.removeEventListener("change", recolor);
    };
  }, [armed]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="page-grid pointer-events-none fixed inset-0 -z-10 block h-full w-full"
    />
  );
}
