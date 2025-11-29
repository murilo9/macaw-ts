import { Entity } from "../../../core/entity/Entity";
import type { Graphic } from "../../../core/entity/interfaces/Graphic";
import type { Game } from "../../../core/Game";
import { Vector2D } from "../../../core/utils/Vector2D";
import { spriteSets } from "../../spritesets";
import { playerAnimations } from "./animations";

export class Player extends Entity implements Graphic {
  Graphic = {
    spriteSet: spriteSets.LumberjackJackSpriteSet,
    tile: playerAnimations.walk_side.currentTile,
    shouldRender: false,
    depth: 0,
    xScale: 4,
    yScale: 4,
  };
  Spatial = {
    position: new Vector2D({ x: 200, y: 200 }),
    velocity: new Vector2D({ angle: 0, module: 0 }),
    rotation: 0,
  };

  private animation = playerAnimations.idle_down;

  constructor() {
    super();
  }

  onRender(game: Game, dt: number): void {
    this.Graphic.tile = this.animation.onUpdate(dt);
  }
}
