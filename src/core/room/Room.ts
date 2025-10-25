import type { Entity } from "../entity/Entity";
import type { Game } from "../Game";

export class Room {
  entities: Array<Entity>;
  private game: Game | null;

  constructor(initialEntities: Array<Entity> = []) {
    this.entities = initialEntities;
    this.game = null;
  }

  /**
   * Executed when this room becomes the current room through Game's setCurrentRoom method.
   */
  public onInit(game: Game) {
    this.game = game;
  }

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
    if (this.game) {
      entity.onInit(this.game);
    } else {
      console.warn(
        "A room is appending an entity without having a game reference. Was this room started?",
        this
      );
    }
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
