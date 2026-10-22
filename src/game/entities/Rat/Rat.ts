import { Circle } from "check2d";
import { Entity } from "../../../core/entity/Entity";
import type { Collider } from "../../../core/entity/interfaces/Collider";
import type { Game } from "../../../core/Game";
import { Vector2D } from "../../../core/utils/Vector2D";
import { spriteSets } from "../../spritesets";
import { rat0Animations } from "./animations";

const SPEED = 80;
const X_POS = 400;
const Y_POS = 400;
const XY_SCALE = 2;
const SPRITE_SIZE = 24;
const FEET_TO_BASE = 6;
const RADIUS = 6; // No need to depend on the scale (the library handles scaling automatically)

export class Rat extends Entity implements Collider {
  Graphic = {
    spriteSet: spriteSets.Rat0SpriteSet,
    tile: rat0Animations.walking.currentTile,
    shouldRender: true,
    depth: 0,
    xScale: XY_SCALE,
    yScale: XY_SCALE,
    xPivot: SPRITE_SIZE / 2, // This division is not related to scale!
    yPivot: SPRITE_SIZE - FEET_TO_BASE,
  };
  Spatial = {
    position: new Vector2D({ x: X_POS, y: Y_POS }),
    velocity: new Vector2D({ angle: 0, module: 0 }),
    rotation: 0,
  };
  Collider = {
    body: new Circle({ x: X_POS, y: Y_POS }, RADIUS),
    static: false,
  };

  private game!: Game;

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

    this.game.emit["dialog:display"]({ text: "Rat is eating cheese!" });
  }

  onInit(game: Game) {
    this.game = game;
    // Setts collison box offset
    this.Collider.body.offset.y = -FEET_TO_BASE * XY_SCALE;
    // Listens to the Input keyUp event in order to eat cheese
    game.Input().onKeyUp((key) => {
      if (key === "Space") {
        this.eatCheese();
      }
    }, this);
    // Listens to the game axis1 in order to move
    game.Input().onAxis1Change((axis) => {
      this.Spatial.velocity.setXY(
        (-axis.left + axis.right) * SPEED,
        (-axis.up + axis.down) * SPEED,
      );
      this.animation =
        Boolean(-axis.left + axis.right) || Boolean(-axis.up + axis.down)
          ? rat0Animations.walking
          : rat0Animations.idle;
    }, this);
    game.Input().onPointerOver(this, (isOver: boolean) => {
      if (isOver) console.log("Mouse is over Rat");
    });
  }

  onRender(game: Game, dt: number): void {
    // Updates animation frame
    this.Graphic.tile = this.animation.onUpdate(dt);
  }

  onRun() {
    // Mirrors sprite on xSpeed flip
    if (this.Spatial.velocity.x !== 0) {
      this.Graphic.xScale = this.Spatial.velocity.x > 0 ? XY_SCALE : -XY_SCALE;
    }
    // Changes animation to idle if finished eating cheese
    if (this.animation.isFinished) {
      this.animation = rat0Animations.idle;
      this.isEating = false;
    }
    this.game.values.set("rat:position", {
      x: this.Spatial.position.x,
      y: this.Spatial.position.y,
    });
  }
}
