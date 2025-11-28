import { SpriteSet } from "../../core/sprite/SpriteSet";
import { mountSpriteSetGrid } from "../../core/utils/mountSpriteSetGrid";
import lumberjackJackImageUrl from "../assets/Lumberjack_Jack.png";

const GRID_BASE_X = 64;
const GRID_BASE_Y = 64;
const INNER_GAP = 36;
const OUTER_GAP = 18;

const img = new Image();
img.src = lumberjackJackImageUrl;

const getTileFromGrid = mountSpriteSetGrid(
  GRID_BASE_X,
  GRID_BASE_Y,
  INNER_GAP,
  OUTER_GAP
);

const tiles = {
  side_idle_0: getTileFromGrid(0, 1),
  side_idle_1: getTileFromGrid(1, 1),
  side_idle_2: getTileFromGrid(2, 1),
  side_idle_3: getTileFromGrid(3, 1),
  side_idle_4: getTileFromGrid(4, 1),
  side_idle_5: getTileFromGrid(5, 1),
  up_idle_0: getTileFromGrid(0, 2),
  up_idle_1: getTileFromGrid(1, 2),
  up_idle_2: getTileFromGrid(2, 2),
  up_idle_3: getTileFromGrid(3, 2),
  up_idle_4: getTileFromGrid(4, 2),
  up_idle_5: getTileFromGrid(5, 2),
  down_idle_0: getTileFromGrid(0, 0),
  down_idle_1: getTileFromGrid(1, 0),
  down_idle_2: getTileFromGrid(2, 0),
  down_idle_3: getTileFromGrid(3, 0),
  down_idle_4: getTileFromGrid(4, 0),
  down_idle_5: getTileFromGrid(5, 0),
  down_walk_0: getTileFromGrid(0, 3),
  down_walk_1: getTileFromGrid(1, 3),
  down_walk_2: getTileFromGrid(2, 3),
  down_walk_3: getTileFromGrid(3, 3),
  down_walk_4: getTileFromGrid(4, 3),
  down_walk_5: getTileFromGrid(5, 3),
  side_walk_0: getTileFromGrid(0, 4),
  side_walk_1: getTileFromGrid(1, 4),
  side_walk_2: getTileFromGrid(2, 4),
  side_walk_3: getTileFromGrid(3, 4),
  side_walk_4: getTileFromGrid(4, 4),
  side_walk_5: getTileFromGrid(5, 4),
  up_walk_0: getTileFromGrid(0, 5),
  up_walk_1: getTileFromGrid(1, 5),
  up_walk_2: getTileFromGrid(2, 5),
  up_walk_3: getTileFromGrid(3, 5),
  up_walk_4: getTileFromGrid(4, 5),
  up_walk_5: getTileFromGrid(5, 5),
};

export const LumberjackJackSpriteSet: SpriteSet = {
  img,
  tiles,
};
