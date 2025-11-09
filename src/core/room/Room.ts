import type { Entity } from "../entity/Entity";
import type { Game } from "../Game";
import type { SpriteSet } from "../sprite/SpriteSet";

export class Room {
  entities: Array<Entity>;
  spriteSets: Record<string, SpriteSet>;

  constructor(
    initialEntities: Array<Entity> = [],
    initialSpriteSets: Record<string, SpriteSet>
  ) {
    this.entities = initialEntities;
    this.spriteSets = initialSpriteSets;
  }

  /**
   * Executed when this room becomes the current room through Game's setCurrentRoom method.
   */
  public onInit(game: Game) {}

  /**
   * Executed when this room stops being the current room, when a new room is passed to Game's setCurrentRoom method.
   * @param game
   */
  public onEnd(game: Game) {}

  /**
   * Called by Game only. Retrieves an entity.
   * @param _id
   * @returns
   */
  public getEntity(_id: string) {
    return this.entities.find((entity) => entity._id === _id);
  }

  /**
   * Called by Game only. Appends an entity.
   * @param entity
   * @param game
   */
  public appendEntity(entity: Entity, game: Game) {
    this.entities.push(entity);
    entity.onInit(game);
  }

  /**
   * Called by Game only. Removes an entity.
   * @param entityOrId
   */
  public removeEntity(entityOrId: Entity | string) {
    if (typeof entityOrId === "string") {
      this.entities = this.entities.filter(
        (entity) => entity._id !== entityOrId
      );
    } else {
      this.entities = this.entities.filter((entity) => entity !== entityOrId);
    }
  }
}
