import { SpriteSet } from "../../core/sprite/SpriteSet";
import { mountSpriteSetDef } from "../../core/utils/mountSpriteSetDef";
import lumberjackJackImageUrl from "../assets/Lumberjack_Jack.png";

const GRID_W = 32;
const GRID_H = 32;

export type LumberjackJackTileName = "left" | "right" | "up" | "down";

const img = new Image();
img.src = lumberjackJackImageUrl;

const tiles = {
  left: mountSpriteSetDef(GRID_W, GRID_H, 0, 0),
  right: mountSpriteSetDef(GRID_W, GRID_H, 0, 0),
  up: mountSpriteSetDef(GRID_W, GRID_H, 0, 0),
  down: mountSpriteSetDef(GRID_W, GRID_H, 0, 0),
};

export const LumberjackJackSpriteSet: SpriteSet<LumberjackJackTileName> = {
  img,
  tiles,
};
