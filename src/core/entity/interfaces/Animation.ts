import type { SpriteSet, TileDef } from "../../sprite/SpriteSet";

/**
 * An animation that can provide a tile for an entity to use it on every render loop.
 */
export class Animation {
  // The animation's SpriteSet
  spriteSet: SpriteSet;
  // Minimum amount of time (in millisecs) that should be waited before going to next tile
  updateThreshold: number;
  // The tile that will be used to render the entity
  currentTile: TileDef;
  // The list of tiles names that compose the animation
  private tilesList: Array<string>;
  // Current tile index
  private currentTileIndex = 0;

  constructor(
    spriteSet: SpriteSet,
    tilesPerSec: number,
    tilesList: Array<string>
  ) {
    this.spriteSet = spriteSet;
    this.tilesList = tilesList;
    this.updateThreshold = 1000 / tilesPerSec;
    this.currentTile = spriteSet.tiles[tilesList[0]];
  }

  /**
   * Updates the current tile. Must be called by entity's onRun method.
   * @param delta Time (in millisecs) past from last render loop.
   */
  onUpdate(delta: number) {
    if (delta >= this.updateThreshold) {
      const nextTileIndex = this.currentTileIndex + 1;
      // Increments (os resets) currentTileIndex
      this.currentTileIndex =
        nextTileIndex >= this.tilesList.length ? 0 : nextTileIndex;
      // Updates currentTile (gets tile name from tilesList, according to currentTileIndex)
      this.currentTile =
        this.spriteSet.tiles[this.tilesList[this.currentTileIndex]];
      // Returns the updated curent tile
      return this.currentTile;
    }
  }
}
