import type { Box, Circle, Ellipse, Polygon } from "check2d";
import type { Graphic } from "./Graphic";

export interface Collider extends Graphic {
  Collider: {
    body: Box | Circle | Ellipse | Polygon;
    static: boolean;
  };
}
