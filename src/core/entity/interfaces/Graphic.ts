import type { Spatial } from "./Spatial";

export interface Graphic extends Spatial {
  Graphic: {
    spriteSetName: string;
    currentFrame: number;
  };
}
