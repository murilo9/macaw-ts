import type { Entity } from "../entity/Entity";
import type { Game } from "../Game";

export class Room {
  entities: Array<Entity>;
  private game: Game;

  constructor(game: Game, initialEntities: Array<Entity> = []) {
    this.game = game;
    this.entities = initialEntities;
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

  public getEntity(_id: string) {
    return this.entities.find((entity) => entity._id === _id);
  }

  public appendEntity(entity: Entity) {
    this.entities.push(entity);
    entity.onInit(this.game);
  }

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
