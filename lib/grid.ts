// Shared geometry for the background grid, so everything drawn "on the lines" agrees on where they are.

export const PITCH = 32; // grid spacing, px

/** Chip footprint in cells, relative to the body's top-left (right chip; the left one mirrors it). */
export const CHIP_EXTENT = { minX: -1, maxX: 2, minY: -6, maxY: 9 };
const CHIP_MARGIN = 8; // min px between a chip and the content column / screen edge

/** The grid is centred on the page (lines through the centre, or offset half a cell — whichever lets a
 *  chip fit in the left gutter) so both gutters mirror. Returns the horizontal grid offset `ox`
 *  (lines at ox + k·PITCH) and the left chip's body x, or null when the gutters are too narrow. */
export function gridLayout(
  width: number,
  columnLeft: number,
): { ox: number; chipAx: number | null } {
  const target = columnLeft / 2 - PITCH / 2; // chip body is 1 cell wide
  for (const phase of [0, PITCH / 2]) {
    const ox = (((width / 2 + phase) % PITCH) + PITCH) % PITCH;
    const ax = ox + Math.round((target - ox) / PITCH) * PITCH;
    // mirrored chip: x → 1 − x, so its extent is [1 − maxX, 1 − minX] cells
    const minX = ax + (1 - CHIP_EXTENT.maxX) * PITCH;
    const maxX = ax + (1 - CHIP_EXTENT.minX) * PITCH;
    if (minX >= CHIP_MARGIN && maxX <= columnLeft - CHIP_MARGIN)
      return { ox, chipAx: ax };
  }
  return { ox: (((width / 2) % PITCH) + PITCH) % PITCH, chipAx: null };
}

/** Left edge of the content column (the first `.wrap` in <main>), or 0 before layout. */
export function columnLeft() {
  return (
    document.querySelector<HTMLElement>("main .wrap")?.getBoundingClientRect()
      .left ?? 0
  );
}
