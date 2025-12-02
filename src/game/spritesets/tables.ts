import type { SpriteSet } from "../../core/sprite/SpriteSet";
import { mountSpriteSetGrid } from "../../core/utils/mountSpriteSetGrid";
import tablesImageUrl from "../assets/Cute_Fantasy/Buildings/House_Decor/Tables.png";

const GRID_BASE_X = 32;
const GRID_BASE_Y = 32;
const INNER_GAP = 0;
const OUTER_GAP = 0;

const img = new Image();
img.src = tablesImageUrl;

const getSmallTileFromGrid = mountSpriteSetGrid(
  GRID_BASE_X,
  GRID_BASE_Y,
  INNER_GAP,
  OUTER_GAP
);

const getLargeTileFromGrid = mountSpriteSetGrid(
  GRID_BASE_X + 16,
  GRID_BASE_Y,
  INNER_GAP,
  OUTER_GAP
);

const tiles = {
  table_sm_sq: getSmallTileFromGrid(0, 0),
  table_sm_rd: getSmallTileFromGrid(1, 0),
  table_lg_sq: getLargeTileFromGrid(0, 1),
};

export const TablesSpriteSet: SpriteSet = {
  img,
  tiles,
};
