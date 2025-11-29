import { Room } from "../../core/room/Room";
import { Rat } from "../entities/Rat/Mouse";
import { Player } from "../entities/Player/Player";
import { spriteSets } from "../spritesets";

export class WorldRoom extends Room {
  constructor() {
    super([new Player(), new Rat()], spriteSets);
  }
}
