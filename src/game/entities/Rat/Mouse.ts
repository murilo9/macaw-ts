import { Entity } from "../../../core/entity/Entity";
import type { Graphic } from "../../../core/entity/interfaces/Graphic";
import type { Game } from "../../../core/Game";
import { Vector2D } from "../../../core/utils/Vector2D";
import { spriteSets } from "../../spritesets";
import { rat0Animations } from "./animations";

export class Rat extends Entity implements Graphic {
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
    velocity: new Vector2D({ angle: 0, module: 0 }),
    rotation: 0,
  };

  private isEating = false;

  private animation = rat0Animations.idle;

  constructor() {
    super();
  }

  eatCheese() {
    if (this.isEating) {
      return;
    }

    this.isEating = true;
    this.animation = rat0Animations.eating;
    this.animation.reset();
  }

  onInit(game: Game) {
    // Listens to the Input keyUp event
    game.onKeyUp((key) => {
      if (key === "Space") {
        this.eatCheese();
      }
    });
  }

  onRender(game: Game, dt: number): void {
    this.Graphic.tile = this.animation.onUpdate(dt);
  }

  onRun() {
    // Mirrors sprite on xSpeed flip
    if (this.Spatial.velocity.x !== 0) {
      this.Graphic.xScale = this.Spatial.velocity.x > 0 ? 2 : -2;
    }
    // Changes animation to idle if finished eating cheese
    if (this.animation.isFinished) {
      this.animation = rat0Animations.idle;
      this.isEating = false;
    }
  }
}
