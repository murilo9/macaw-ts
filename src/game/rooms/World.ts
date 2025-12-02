import { Room } from "../../core/room/Room";
import { Rat } from "../entities/Rat/Rat";
import { spriteSets } from "../spritesets";
import { TableSmallSquared } from "../entities/Table";

export class WorldRoom extends Room {
  constructor() {
    super([new TableSmallSquared(), new Rat()], spriteSets);
  }
}
