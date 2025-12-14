import type { Entity } from "../entity/Entity";
import type { Spatial } from "../entity/interfaces/Spatial";

export function processateSpatialEntity(entity: Entity & Spatial, dt: number) {
  // Updates x and y speeds based on entity's rotation
  if (entity.Spatial.rotation !== 0) {
    // Increments (or decrements) velocity's angle (rotation is in degrees per second, so multiply by dt/1000 to convert to degrees per frame)
    entity.Spatial.velocity.setAngle(
      entity.Spatial.velocity.getAngle() + entity.Spatial.rotation * (dt / 1000)
    );
  }
  // Updates x and y position (speed is in pixels per second, so multiply by dt)
  entity.Spatial.position.x += (entity.Spatial.velocity.x * dt) / 1000;
  entity.Spatial.position.y += (entity.Spatial.velocity.y * dt) / 1000;
}
