import type { Graphic } from "../entity/interfaces/Graphic";

const DRAW_SPRITE_BOXES = false;
const DRAW_PIVOT_CROSS = true;

export function drawEntity(entity: Graphic, ctx: CanvasRenderingContext2D) {
  // Determinates scaled sizes
  const scaledXPivot = entity.Graphic.xPivot * entity.Graphic.xScale;
  const scaledYPivot = entity.Graphic.yPivot * entity.Graphic.yScale;
  const scaledTileWidth = entity.Graphic.tile.width * entity.Graphic.xScale;
  const scaledTileHeight = entity.Graphic.tile.height * entity.Graphic.yScale;
  // Only use transformations if mirroring is needed (negative scale)
  if (entity.Graphic.xScale < 0 || entity.Graphic.yScale < 0) {
    // Save context state for transformations
    ctx.save();

    // Translate to sprite position
    ctx.translate(entity.Spatial.position.x, entity.Spatial.position.y);

    // Apply scaling (negative values will flip the sprite)
    ctx.scale(entity.Graphic.xScale, entity.Graphic.yScale);

    // Adjust position for negative scales (flip origin)
    if (entity.Graphic.xScale < 0) {
      ctx.translate(-entity.Graphic.tile.width, 0);
    }
    if (entity.Graphic.yScale < 0) {
      ctx.translate(0, -entity.Graphic.tile.height);
    }

    // Draw the image at (0, 0) relative to transformed context
    ctx.drawImage(
      entity.Graphic.spriteSet.img,
      entity.Graphic.tile.xOrigin,
      entity.Graphic.tile.yOrigin,
      entity.Graphic.tile.width,
      entity.Graphic.tile.height,
      0 - scaledXPivot / Math.abs(entity.Graphic.xScale),
      0 - scaledYPivot / Math.abs(entity.Graphic.yScale),
      entity.Graphic.tile.width,
      entity.Graphic.tile.height
    );
    // Draws entity's collision box (also relative to transformed context)
    if (DRAW_SPRITE_BOXES) {
      ctx.strokeStyle = "#00FFCC";
      ctx.beginPath(); // Start a new path
      ctx.rect(0, 0, entity.Graphic.tile.width, entity.Graphic.tile.height);
      ctx.stroke();
    }

    // Restores context state
    ctx.restore();
  }
  // Renders entity without mirroring (no transformations)
  else {
    // Direct drawImage for non-mirrored sprites (better performance)
    ctx.drawImage(
      entity.Graphic.spriteSet.img,
      entity.Graphic.tile.xOrigin,
      entity.Graphic.tile.yOrigin,
      entity.Graphic.tile.width,
      entity.Graphic.tile.height,
      entity.Spatial.position.x - scaledXPivot,
      entity.Spatial.position.y - scaledYPivot,
      entity.Graphic.tile.width * entity.Graphic.xScale,
      entity.Graphic.tile.height * entity.Graphic.yScale
    );
    // Draws entity's sprite tile box
    if (DRAW_SPRITE_BOXES) {
      ctx.strokeStyle = "#00FFCC";
      ctx.beginPath(); // Start a new path
      ctx.rect(
        entity.Spatial.position.x,
        entity.Spatial.position.y,
        entity.Graphic.tile.width * entity.Graphic.xScale,
        entity.Graphic.tile.height * entity.Graphic.yScale
      );
      ctx.stroke();
    }
  }
  // Draw entity's pivot cross
  if (DRAW_PIVOT_CROSS) {
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    // Draws the horizontal line
    ctx.moveTo(
      entity.Spatial.position.x - scaledTileWidth / 2,
      entity.Spatial.position.y
    );
    ctx.lineTo(
      entity.Spatial.position.x + scaledTileWidth / 2,
      entity.Spatial.position.y
    );
    // Draws the vertical line
    ctx.moveTo(
      entity.Spatial.position.x,
      entity.Spatial.position.y - scaledTileHeight / 2
    );
    ctx.lineTo(
      entity.Spatial.position.x,
      entity.Spatial.position.y + scaledTileHeight / 2
    );
    ctx.stroke();
  }
}
