import type { Spatial } from "./Spatial";
import { type TileDef } from "../../sprite/SpriteSet";

export interface Graphic extends Spatial {
  Graphic: {
    tile: TileDef;
    shouldRender: boolean;
  };
}
