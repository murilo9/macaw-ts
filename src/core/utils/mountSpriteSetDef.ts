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
  posY: number
): TileDef => [
  posX * width,
  posY * height,
  posX * width + width,
  posY * height + height,
];
