import { Room } from "../../core/room/Room";
import { Mouse } from "../entities/Mouse/Mouse";
import { Player } from "../entities/Player/Player";
import { spriteSets } from "../spritesets";

export class WorldRoom extends Room {
  constructor() {
    super([new Player(), new Mouse()], spriteSets);
  }
}
