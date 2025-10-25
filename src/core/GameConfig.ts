import type { Room } from "./room/Room";

export type GameConfig = {
  initialRoom: Room;
  canvas: {
    width: number;
    height: number;
    background: string;
  };
};
