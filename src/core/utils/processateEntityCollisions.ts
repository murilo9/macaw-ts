import type { Entity } from "../entity/Entity";
import type { Collider } from "../entity/interfaces/Collider";

export function processateEntityCollisions(entity: Entity & Collider) {
  // Updates collision body position
  entity.Collider.body.setPosition(
    entity.Spatial.position.x,
    entity.Spatial.position.y,
    false
  );
  // Updates collison body scale
  entity.Collider.body.setScale(
    entity.Graphic.xScale,
    entity.Graphic.yScale,
    false
  );
  entity.Collider.body.updateBody();
}
