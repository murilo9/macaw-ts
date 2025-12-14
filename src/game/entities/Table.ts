import { Box } from "check2d";
import { Entity } from "../../core/entity/Entity";
import type { Collider } from "../../core/entity/interfaces/Collider";
import { Vector2D } from "../../core/utils/Vector2D";
import { GLOBAL_SCALE } from "../constants";
import { spriteSets } from "../spritesets";

const X_POS = 100;
const Y_POS = 200;
const TILE_SIZE = 32;

export class TableSmallSquared extends Entity implements Collider {
  Graphic = {
    spriteSet: spriteSets.TablesSpriteSet,
    tile: spriteSets.TablesSpriteSet.tiles["table_sm_sq"],
    shouldRender: true,
    depth: 0,
    xScale: GLOBAL_SCALE,
    yScale: GLOBAL_SCALE,
    xPivot: 0,
    yPivot: TILE_SIZE,
  };
  Spatial = {
    position: new Vector2D({ x: X_POS, y: Y_POS }),
    velocity: new Vector2D(),
    rotation: 0,
  };
  Collider = {
    body: new Box({ x: X_POS, y: Y_POS }, TILE_SIZE, TILE_SIZE / 2, {
      isStatic: true,
    }),
    static: true,
  };

  constructor() {
    super();
    // Sets collision body offset
    this.Collider.body.offset.y = -(TILE_SIZE / 2) * GLOBAL_SCALE;
  }
}
