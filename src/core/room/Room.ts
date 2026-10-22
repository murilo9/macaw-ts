import { System } from "check2d";
import type { Entity } from "../entity/Entity";
import type { Graphic } from "../entity/interfaces/Graphic";
import type { Game } from "../Game";
import type { SpriteSet } from "../sprite/SpriteSet";
import type { Collider } from "../entity/interfaces/Collider";

export class Room {
  private game: Game | null = null;
  private collisionSystem: System;
  readonly entities: Array<Entity>;
  spriteSets: Record<string, SpriteSet>;
  // Entities sorted by Graphic depth
  readonly sortedGraphicEntities: Array<Entity & Graphic>;
  readonly colliderEntities: Array<Entity & Collider>;

  constructor(initialSpriteSets: Record<string, SpriteSet>) {
    this.spriteSets = initialSpriteSets;
    this.entities = [];
    this.sortedGraphicEntities = [];
    this.colliderEntities = [];
    this.collisionSystem = new System();
  }

  // ------------------------------ PRIVATE INTERFACE (NON-OVERRIDEABLE) ------------------------------

  /**
   * Sorts the Graphic entities list based on their depth value.
   */
  private readonly _sortGraphicEntities = (
    entitiesToPush: Array<Entity & Graphic>,
  ) => {
    for (const entity of entitiesToPush) {
      this.sortedGraphicEntities.push(entity);
    }
    this.sortedGraphicEntities.sort(
      (entityA, entityB) => entityA.Graphic.depth - entityB.Graphic.depth,
    );
  };

  // ------------------------------ PUBLIC INTERFACE (NON-OVERRIDEABLE) ------------------------------

  /**
   * Called by Game only. Initializes the Room.
   * @param game
   * @param spritesetsEl
   */
  public readonly _beforeInit = (game: Game, spritesetsEl: HTMLDivElement) => {
    this.game = game;
    // Appends this room's spritesets' img elements to the game's spritesetsEl DOM element.
    Object.values(this.spriteSets).forEach((spriteSet) => {
      spritesetsEl.append(spriteSet.img);
    });
    // Calls room's onInit method
    this.onInit(game);
  };

  /**
   *  Retrieves an entity.
   * @param _id
   * @returns
   */
  public readonly getEntityById = (_id: string) => {
    return this.entities.find((entity) => entity._id === _id);
  };

  /**
   * Appends an entity.
   * @param entity
   * @param game
   */
  public readonly appendEntity = (entity: Entity) => {
    if (!this.game) {
      throw new Error("Room.appendEntity: could not find this.game");
    }
    this.entities.push(entity);
    entity.onInit(this.game);
    // If entity is Grapihc
    if (entity._is("Graphic")) {
      this._sortGraphicEntities([entity as Entity & Graphic]);
      // If entity is Collider
      if (entity._is("Collider")) {
        // Sets isStatic attribue
        (entity as Entity & Collider).Collider.body.isStatic = (
          entity as Entity & Collider
        ).Collider.static;
        // Inserts it in collierEntities array
        this.colliderEntities.push(entity as unknown as Entity & Collider);
        // Inserts its body in the room's collision system
        this.collisionSystem.insert(
          (entity as Entity & Collider).Collider.body,
        );
      }
    }
  };

  public readonly appendEntities = (entities: Entity[]) => {
    for (const entity of entities) {
      this.appendEntity(entity);
    }
  };

  /**
   * Removes an entity from every list: entities, sortedGraphicEntities and colliderEntities.
   * @param entityOrId
   */
  public readonly removeEntity = (entity: Entity) => {
    if (!this.game) {
      throw new Error("Room.removeEntity: could not find this.game");
    }
    // Cleanup entity's input listeners
    this.game.Input()._cleanupListeners(entity);
    const entityIndex = this.entities.findIndex((e) => entity._id === e._id);
    if (entityIndex >= 0) {
      // If entitty if Graphic, removes it from the sortedGraphicEntities array
      if (entity._is("Graphic")) {
        // If entity is Collider, Removes it from the collierEntities array
        if (entity._is("Collider")) {
          const colliderEntitiesIndex = this.colliderEntities.findIndex(
            (e) => entity._id === e._id,
          );
          if (colliderEntitiesIndex >= 0) {
            this.colliderEntities.splice(colliderEntitiesIndex, 1);
          }
          // Removes its body from the room's collision system
          this.collisionSystem.remove(
            (entity as Entity & Collider).Collider.body,
          );
        }
        const sortedGraphicEntityIndex = this.sortedGraphicEntities.findIndex(
          (e) => (e as Entity & Graphic)._id === e._id,
        );
        if (sortedGraphicEntityIndex >= 0) {
          this.sortedGraphicEntities.splice(sortedGraphicEntityIndex, 1);
        }
      }
      // Finally, removes the entity from the entities list
      this.entities.splice(entityIndex, 1);
    }
  };

  /**
   * Removes the room's loaded spriteSets from game's spritesetsEl.
   * @param game
   * @param spritesetsEl
   */
  public readonly _beforeEnd = (game: Game, spritesetsEl: HTMLDivElement) => {
    // Remove the loaded spritesets
    const loadedSpritesets = spritesetsEl.childNodes;
    loadedSpritesets.forEach((loadedSpriteset) =>
      spritesetsEl.removeChild(loadedSpriteset),
    );
    // Remove all entities from the room
    for (const entity of this.entities) {
      this.removeEntity(entity);
    }
    // Calls room's onEnd method
    this.onEnd(game);
    // Cleans up current reference to Game instance
    this.game = null;
  };

  public readonly _resolveCollision = (entity: Entity & Collider) => {
    this.collisionSystem.checkOne(entity.Collider.body, (response) => {
      const { a, b, overlapV } = response;
      a.setPosition(a.pos.x - overlapV.x, a.pos.y - overlapV.y);
      entity.Spatial.position.x -= overlapV.x;
      entity.Spatial.position.y -= overlapV.y;
    });
  };

  /**
   * Draws collision system's entities' collision boxes
   * @param ctx
   */
  public readonly _drawCollisionBoxes = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "rgba(0,255,0,0.2)";
    ctx.beginPath();
    // draw whole system
    this.collisionSystem.draw(ctx);
    ctx.fill();
  };

  // ------------------------------ PUBLIC INTERFACE (OVERRIDEABLE) ------------------------------

  /**
   * Executed when this room becomes the current room, through Game's setCurrentRoom method.
   */
  public onInit(game: Game) {}

  /**
   * Executed when this room stops being the current room, when a new room is passed to Game's setCurrentRoom method.
   * @param game
   */
  public onEnd(game: Game) {}
}
