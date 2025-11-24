import type { Entity } from "../entity/Entity";
import type { Graphic } from "../entity/interfaces/Graphic";
import type { Game } from "../Game";
import type { SpriteSet } from "../sprite/SpriteSet";

export class Room {
  entities: Array<Entity>;
  spriteSets: Record<string, SpriteSet>;
  sortedGraphicEntities: Array<Graphic>;

  constructor(
    initialEntities: Array<Entity> = [],
    initialSpriteSets: Record<string, SpriteSet>
  ) {
    this.entities = initialEntities;
    this.spriteSets = initialSpriteSets;
    this.sortedGraphicEntities = [];
  }

  // ------------------------- NON-OVERRIDEABLE -------------------------

  /**
   * Called by Game only. Initializes the Room.
   * @param game
   * @param spritesetsEl
   */
  public readonly beforeInit = (game: Game, spritesetsEl: HTMLDivElement) => {
    // Appends this room's spritesets' img elements to the game's spritesetsEl DOM element.
    Object.values(this.spriteSets).forEach((spriteSet) => {
      spritesetsEl.append(spriteSet.img);
    });
    // Builds the sortedGraphicEntities array
    this.sortedGraphicEntities = this.entities.filter((entity) =>
      entity._is("Graphic")
    ) as unknown as Array<Graphic>;
    this.sortedGraphicEntities.sort(
      (entityA, entityB) => entityA.Graphic.depth - entityB.Graphic.depth
    );
    // Calls room's onInit method
    this.onInit();
  };

  /**
   * Called by Game only. Retrieves an entity.
   * @param _id
   * @returns
   */
  public readonly getEntity = (_id: string) => {
    return this.entities.find((entity) => entity._id === _id);
  };

  /**
   * Called by Game only. Appends an entity.
   * @param entity
   * @param game
   */
  public readonly appendEntity = (entity: Entity, game: Game) => {
    this.entities.push(entity);
    entity.onInit(game);
  };

  /**
   * Called by Game only. Removes an entity.
   * @param entityOrId
   */
  public readonly removeEntity = (_id: Entity | string) => {
    const entityIndex = this.entities.findIndex((entity) => entity._id === _id);
    if (entityIndex >= 0) {
      this.entities.splice(entityIndex, 1);
    }
  };

  /**
   * Called by Game only. Removes the room's loaded spriteSets from game's spritesetsEl.
   * @param game
   * @param spritesetsEl
   */
  public readonly beforeEnd = (game: Game, spritesetsEl: HTMLDivElement) => {
    const loadedSpritesets = spritesetsEl.childNodes;
    loadedSpritesets.forEach((loadedSpriteset) =>
      spritesetsEl.removeChild(loadedSpriteset)
    );
    // Calls room's onEnd method
    this.onEnd(game);
  };

  // ------------------------- OVERRIDEABLE -------------------------

  /**
   * Executed when this room becomes the current room, through Game's setCurrentRoom method.
   */
  public onInit() {}

  /**
   * Executed when this room stops being the current room, when a new room is passed to Game's setCurrentRoom method.
   * @param game
   */
  public onEnd(game: Game) {}
}
