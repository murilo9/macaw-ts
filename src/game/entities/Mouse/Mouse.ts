import { Entity } from "../../../core/entity/Entity";
import type { Graphic } from "../../../core/entity/interfaces/Graphic";
import type { Game } from "../../../core/Game";
import { Vector2D } from "../../../core/utils/Vector2D";
import { spriteSets } from "../../spritesets";
import { rat0Animations } from "./animations";

export class Mouse extends Entity implements Graphic {
  Graphic = {
    spriteSet: spriteSets.Rat0SpriteSet,
    tile: rat0Animations.walking.currentTile,
    shouldRender: true,
    depth: 0,
    xScale: 2,
    yScale: 2,
  };
  Spatial = {
    position: new Vector2D({ x: 300, y: 200 }),
    velocity: new Vector2D({ angle: -45, module: 120 }),
    rotation: 80,
  };

  private animation = rat0Animations.walking;

  constructor() {
    super();
  }

  onRender(game: Game, dt: number): void {
    this.Graphic.tile = this.animation.onUpdate(dt);
  }

  onRun() {
    if (this.Spatial.velocity.x !== 0) {
      this.Graphic.xScale = this.Spatial.velocity.x > 0 ? 2 : -2;
    }
  }
}
