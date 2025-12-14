import { Box } from "check2d";
import { Entity } from "../../core/entity/Entity";
import type { Collider } from "../../core/entity/interfaces/Collider";
import { Vector2D } from "../../core/utils/Vector2D";
import { GLOBAL_SCALE } from "../constants";
import { spriteSets } from "../spritesets";

const X_POS = 100;
const Y_POS = 200;

export class TableSmallSquared extends Entity implements Collider {
  Graphic = {
    spriteSet: spriteSets.TablesSpriteSet,
    tile: spriteSets.TablesSpriteSet.tiles["table_sm_sq"],
    shouldRender: true,
    depth: 0,
    xScale: GLOBAL_SCALE,
    yScale: GLOBAL_SCALE,
  };
  Spatial = {
    position: new Vector2D({ x: X_POS, y: Y_POS }),
    velocity: new Vector2D(),
    rotation: 0,
  };
  Collider = {
    body: new Box({ x: X_POS, y: Y_POS }, GLOBAL_SCALE * 8, GLOBAL_SCALE * 4),
    static: true,
  };

  constructor() {
    super();
  }
}
