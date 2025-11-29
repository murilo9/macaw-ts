import type { Vector2D } from "../../utils/Vector2D";

export interface Spatial {
  Spatial: {
    // Entity's x and  position in Room
    position: Vector2D;
    // Entity's x and y speeds
    velocity: Vector2D;
    // Entity's change in x and y speeds, in degrees per second
    rotation: number;
  };
}
