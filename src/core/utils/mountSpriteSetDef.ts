import type { TileDef } from "../sprite/SpriteSet";

/**
 * Neatly mounts a SpriteSetDef based on the grid's width, height and position.
 * @param width Width, in pixels
 * @param height Height, in pixels
 * @param posX X Position, zero-indexed
 * @param posY Y Position, zero-indexed
 * @returns
 */
export const mountSpriteSetDef = (
  width: number,
  height: number,
  posX: number,
  posY: number,
  innerGapX = 0,
  innerGapY = 0,
  outerGapX = 0,
  outerGapY = 0
): TileDef => ({
  xOrigin: posX * width + innerGapX * posX + outerGapX,
  yOrigin: posY * height + innerGapY * posY + outerGapY,
  width,
  height,
});
