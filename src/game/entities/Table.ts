import { Entity } from "../../core/entity/Entity";
import type { Graphic } from "../../core/entity/interfaces/Graphic";
import { Vector2D } from "../../core/utils/Vector2D";
import { GLOBAL_SCALE } from "../constants";
import { spriteSets } from "../spritesets";

export class TableSmallSquared extends Entity implements Graphic {
  Graphic = {
    spriteSet: spriteSets.TablesSpriteSet,
    tile: spriteSets.TablesSpriteSet.tiles["table_sm_sq"],
    shouldRender: true,
    depth: 0,
    xScale: GLOBAL_SCALE,
    yScale: GLOBAL_SCALE,
  };
  Spatial = {
    position: new Vector2D({ x: 100, y: 200 }),
    velocity: new Vector2D(),
    rotation: 0,
  };

  constructor() {
    super();
  }
}
