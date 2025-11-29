import type { Spatial } from "./Spatial";
import { SpriteSet, type TileDef } from "../../sprite/SpriteSet";

export interface Graphic extends Spatial {
  Graphic: {
    // The SpriteSet to draw (provides the img element)
    spriteSet: SpriteSet;
    // The tile that should be rendered in the current render loop
    tile: TileDef;
    // Whether the entity's sprite should be rendered
    shouldRender: boolean;
    // Used to define the sprite's rendering z-index
    depth: number;
    // Used to scale sprite drawing
    xScale: number;
    // Used to scale sprite drawing
    yScale: number;
  };
}
