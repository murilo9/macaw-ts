import type { SpriteSet } from "../../core/sprite/SpriteSet";
import { mountSpriteSetGrid } from "../../core/utils/mountSpriteSetGrid";
import rat0ImageUrl from "../assets/Cute_Fantasy/Animals/Mouse/Mouse_01.png";

const GRID_BASE_X = 32;
const GRID_BASE_Y = 32;
const INNER_GAP = 8;
const OUTER_GAP = 4;

const img = new Image();
img.src = rat0ImageUrl;

const getTileFromGrid = mountSpriteSetGrid(
  GRID_BASE_X,
  GRID_BASE_Y,
  INNER_GAP,
  OUTER_GAP
);

const tiles = {
  idle_0: getTileFromGrid(0, 0),
  idle_1: getTileFromGrid(1, 0),
  idle_2: getTileFromGrid(2, 0),
  idle_3: getTileFromGrid(3, 0),
  idle_4: getTileFromGrid(4, 0),
  idle_5: getTileFromGrid(5, 0),
  walk_0: getTileFromGrid(0, 1),
  walk_1: getTileFromGrid(1, 1),
  walk_2: getTileFromGrid(2, 1),
  walk_3: getTileFromGrid(3, 1),
  walk_4: getTileFromGrid(4, 1),
  walk_5: getTileFromGrid(5, 1),
  eat_0: getTileFromGrid(0, 2),
  eat_1: getTileFromGrid(1, 2),
  eat_2: getTileFromGrid(2, 2),
  eat_3: getTileFromGrid(3, 2),
  eat_4: getTileFromGrid(4, 2),
  eat_5: getTileFromGrid(5, 2),
  eat_6: getTileFromGrid(6, 2),
  eat_7: getTileFromGrid(7, 2),
  eat_8: getTileFromGrid(8, 2),
  eat_9: getTileFromGrid(9, 2),
};

export const Rat0SpriteSet: SpriteSet = {
  img,
  tiles,
};
