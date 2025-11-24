import { Entity } from "../../../core/entity/Entity";
import type { Graphic } from "../../../core/entity/interfaces/Graphic";
import type { Game } from "../../../core/Game";
import { spriteSets } from "../../spritesets";
import { playerAnimations } from "./animations";

export class Player extends Entity implements Graphic {
  Graphic = {
    spriteSet: spriteSets.LumberjackJackSpriteSet,
    tile: playerAnimations.walk_side.currentTile,
    shouldRender: true,
    depth: 0,
  };
  Spatial = { x: 200, y: 200, xSpeed: 0, ySpeed: 0 };

  private animation = playerAnimations.walk_side;

  constructor() {
    super();
  }

  onRender(game: Game, dt: number): void {
    this.Graphic.tile = this.animation.onUpdate(dt);
  }
}
