import type { SpriteSet, TileDef } from "../../sprite/SpriteSet";

export type AnimationBehavior =
  | "stop"
  | "repeat"
  | "reverse-stop"
  | "repeat-reverse";

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
  // Stores the amount of time past between render loops. Used to update currentTile
  acumulatedDelta: number = 0;
  // The list of tiles names that compose the animation
  private tilesList: Array<string>;
  // Current tile index
  private currentTileIndex = 0;
  // Whether the animation is reversing
  private isReversing: boolean;
  // Animation behavior
  onFinish: AnimationBehavior;
  // Whether the animation has finished
  isFinished: boolean;

  constructor(
    spriteSet: SpriteSet,
    tilesPerSec: number,
    tilesList: Array<string>,
    onFinish: AnimationBehavior = "repeat",
    startReversing = false
  ) {
    this.spriteSet = spriteSet;
    this.tilesList = tilesList;
    this.updateThreshold = 1000 / tilesPerSec;
    this.currentTile = spriteSet.tiles[tilesList[0]];
    this.onFinish = onFinish;
    this.isFinished = false;
    this.isReversing = startReversing;
  }

  /**
   * Updates the current tile. Must be called by entity's onRun method.
   * @param delta Time (in millisecs) past from last render loop.
   */
  onUpdate(delta: number): TileDef {
    this.acumulatedDelta += delta;
    //console.log(delta, this.updateThreshold);
    if (this.acumulatedDelta >= this.updateThreshold) {
      this.acumulatedDelta = 0;
      let nextTileIndex;
      switch (this.onFinish) {
        case "repeat":
          nextTileIndex = this.currentTileIndex + 1;
          // Increments (or resets) currentTileIndex
          this.currentTileIndex =
            nextTileIndex >= this.tilesList.length ? 0 : nextTileIndex;
          break;
        case "repeat-reverse":
          // If currentTileIndex reached max, reverse
          if (this.currentTileIndex === this.tilesList.length) {
            this.isReversing = true;
          }
          // If currentTileIndex reached min, un-reverse
          else if (this.currentTileIndex === 0) {
            this.isReversing = false;
          }
          nextTileIndex = this.currentTileIndex + (this.isReversing ? -1 : 1);
          break;
        case "reverse-stop":
          // Short-circuits if already reversed and currentTileIndex reached min
          if (this.isReversing && this.currentTileIndex === 0) {
            this.isFinished = true;
            break;
          }
          // If currentTileIndex reached max, reverse
          if (this.currentTileIndex === this.tilesList.length) {
            this.isReversing = true;
          }
          nextTileIndex = this.currentTileIndex + (this.isReversing ? -1 : 1);
          break;
        case "stop":
          // Short-circuits if currentTileIndex reached max
          if (this.currentTileIndex === this.tilesList.length - 1) {
            this.isFinished = true;
            break;
          }
          nextTileIndex = this.currentTileIndex + 1;
          // Increments (or resets) currentTileIndex
          this.currentTileIndex = nextTileIndex;
          break;
      }
      // Updates currentTile (gets tile name from tilesList, according to currentTileIndex)
      this.currentTile =
        this.spriteSet.tiles[this.tilesList[this.currentTileIndex]];
    }
    // Returns the updated curent tile
    return this.currentTile;
  }

  setTilesPerSec(tilesPerSec: number) {
    this.updateThreshold = 1000 / tilesPerSec;
  }

  // Restarts the animation
  reset() {
    this.isFinished = false;
    this.currentTileIndex = 0;
    this.currentTile =
      this.spriteSet.tiles[this.tilesList[this.currentTileIndex]];
  }
}
