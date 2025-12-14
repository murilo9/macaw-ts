import { System } from "check2d";
import type { Entity } from "../entity/Entity";
import type { Graphic } from "../entity/interfaces/Graphic";
import type { Game } from "../Game";
import type { SpriteSet } from "../sprite/SpriteSet";
import type { Collider } from "../entity/interfaces/Collider";

export class Room {
  entities: Array<Entity>;
  spriteSets: Record<string, SpriteSet>;
  // Entities sorted by Graphic depth
  sortedGraphicEntities: Array<Graphic>;
  colliderEntities: Array<Entity & Collider>;
  private collisionSystem: System;

  constructor(
    initialEntities: Array<Entity> = [],
    initialSpriteSets: Record<string, SpriteSet>
  ) {
    this.entities = initialEntities;
    this.spriteSets = initialSpriteSets;
    this.sortedGraphicEntities = [];
    this.colliderEntities = [];
    this.collisionSystem = new System();
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
    // Appends all initial entities
    this.entities.forEach((entity) => {
      this.appendEntity(entity, game);
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
    // If entity is Collider
    if (entity._is("Collider")) {
      // Sets isStatic attribue
      (entity as unknown as Entity & Collider).Collider.body.isStatic = (
        entity as unknown as Entity & Collider
      ).Collider.static;
      // Inserts it in collierEntities array
      this.colliderEntities.push(entity as unknown as Entity & Collider);
      // Inserts its body in the room's collision system
      this.collisionSystem.insert(
        (entity as unknown as Collider).Collider.body
      );
    }
  };

  /**
   * Called by Game only. Removes an entity.
   * @param entityOrId
   */
  public readonly removeEntity = (_id: Entity | string) => {
    const entityIndex = this.entities.findIndex((entity) => entity._id === _id);
    if (entityIndex >= 0) {
      this.entities.splice(entityIndex, 1);

      // If entity is Collider
      if (this.entities[entityIndex]._is("Collider")) {
        // Removes it from the collierEntities array
        const colliderEntitiesIndex = this.colliderEntities.findIndex(
          (entity) => entity._id === _id
        );
        if (colliderEntitiesIndex >= 0) {
          this.colliderEntities.splice(colliderEntitiesIndex, 1);
        }
        // Removes its body from the room's collision system
        this.collisionSystem.remove(
          (this.entities[entityIndex] as unknown as Collider).Collider.body
        );
      }
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

  public _resolveCollision(entity: Entity & Collider) {
    this.collisionSystem.checkOne(entity.Collider.body, (response) => {
      const { a, b, overlapV } = response;
      a.setPosition(a.pos.x - overlapV.x, a.pos.y - overlapV.y);
      entity.Spatial.position.x -= overlapV.x;
      entity.Spatial.position.y -= overlapV.y;
    });
  }

  /**
   * Draws collision system's entities' collision boxes
   * @param ctx
   */
  public _drawCollisionBoxes(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(0,255,0,0.2)";
    ctx.beginPath();
    // draw whole system
    this.collisionSystem.draw(ctx);
    ctx.fill();
  }

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
