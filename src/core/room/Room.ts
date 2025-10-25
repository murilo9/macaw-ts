import type { Entity } from "../entity/Entity";

export class Room {
  entities: Array<Entity>;

  constructor(initialEntities: Array<Entity> = []) {
    this.entities = initialEntities;
  }
}
