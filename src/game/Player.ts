import { Entity } from "../core/entity/Entity";
import type { Game } from "../core/Game";

export class Player extends Entity {
  constructor() {
    super();
  }

  onRun(game: Game) {
    console.log("Player has the game!");
  }
}
