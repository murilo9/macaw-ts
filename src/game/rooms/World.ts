import { Room } from "../../core/room/Room";
import { Rat } from "../entities/Rat/Rat";
import { spriteSets } from "../spritesets";
import { TableSmallSquared } from "../entities/Table";
import type { Game } from "../../core/Game";

export class WorldRoom extends Room {
  constructor() {
    super(spriteSets);
  }

  onInit(game: Game) {
    game.Room().appendEntities([new TableSmallSquared(), new Rat()]);
  }
}
