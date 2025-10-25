import { v4 as uuidv4 } from "uuid";
import type { Game } from "../Game";

type EntityInterfaceName = "Graphic" | "Spatial";

/**
 * An object that gets processed by Game's processateEntities method.
 */
export class Entity {
  public readonly _id: string;

  constructor() {
    this._id = uuidv4();
  }

  // Executed at every logic loop
  onRun(game: Game, dt: number) {}

  /**
   * Type guard for interfaces that extend Entity
   * @param interfaceName
   * @returns
   */
  _is(interfaceName: EntityInterfaceName) {
    return (this as any)[interfaceName] !== undefined;
  }
}
