import { v4 as uuidv4 } from "uuid";
import type { Game } from "../Game";

type EntityInterfaceName = "Graphic" | "Spatial" | "Collider";

/**
 * An object that gets processed by Game's processateEntities method.
 */
export class Entity {
  public readonly _id: string;

  constructor() {
    this._id = uuidv4();
  }

  // Executed once the entity is inserted in the room by Game's appendEntity method
  onInit(game: Game) {}

  /**
   * Executed at every logic loop.
   * @param game Current Game instance.
   * @param dt Amount (in milisseconds) since the end of the last logic loop.
   */
  onRun(game: Game, dt: number) {}

  // Executed at every render loop
  onRender(game: Game, dt: number) {}

  /**
   * Type guard for interfaces that extend Entity
   * @param interfaceName
   * @returns
   */
  _is(interfaceName: EntityInterfaceName) {
    return (this as never)[interfaceName] !== undefined;
  }
}
