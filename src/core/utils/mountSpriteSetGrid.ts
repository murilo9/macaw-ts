import type { TileDef } from "../sprite/SpriteSet";

/**
 * Returns a function that can be used to get tiles from a custom grid.
 * @param gridBase The full dimension
 * @param innerGap
 * @param outerGap
 * @returns
 */
export const mountSpriteSetGrid =
  (gridBaseX: number, gridBaseY: number, innerGap = 0, outerGap = 0) =>
  (posX: number, posY: number): TileDef => {
    const gridWidth = gridBaseX - innerGap;
    const gridHeight = gridBaseY - innerGap;
    const innerGapX = innerGap;
    const innerGapY = innerGap;
    const outerGapX = outerGap;
    const outerGapY = outerGap;
    return {
      xOrigin: posX * gridWidth + innerGapX * posX + outerGapX,
      yOrigin: posY * gridHeight + innerGapY * posY + outerGapY,
      width: gridWidth,
      height: gridHeight,
    };
  };
