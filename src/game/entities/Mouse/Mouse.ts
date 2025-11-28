import { Entity } from "../../../core/entity/Entity";
import type { Graphic } from "../../../core/entity/interfaces/Graphic";
import type { Game } from "../../../core/Game";
import { spriteSets } from "../../spritesets";
import { mouseAnimations } from "./animations";

export class Mouse extends Entity implements Graphic {
  Graphic = {
    spriteSet: spriteSets.Mouse0SpriteSet,
    tile: mouseAnimations.walking.currentTile,
    shouldRender: true,
    depth: 0,
  };
  Spatial = { x: 300, y: 200, xSpeed: 0, ySpeed: 0 };

  private animation = mouseAnimations.eating;

  constructor() {
    super();
  }

  onRender(game: Game, dt: number): void {
    this.Graphic.tile = this.animation.onUpdate(dt);
  }
}
