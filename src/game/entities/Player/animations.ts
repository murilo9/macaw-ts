import { Animation } from "../../../core/entity/interfaces/Animation";
import { spriteSets } from "../../spritesets";

const SPEED = 8;

export const playerAnimations = {
  idle_down: new Animation(spriteSets.LumberjackJackSpriteSet, SPEED, [
    "down_idle_0",
    "down_idle_1",
    "down_idle_2",
    "down_idle_3",
    "down_idle_4",
    "down_idle_5",
  ]),
  walk_down: new Animation(spriteSets.LumberjackJackSpriteSet, SPEED, [
    "down_walk_0",
    "down_walk_1",
    "down_walk_2",
    "down_walk_3",
    "down_walk_4",
    "down_walk_5",
  ]),
  walk_side: new Animation(spriteSets.LumberjackJackSpriteSet, SPEED, [
    "side_walk_0",
    "side_walk_1",
    "side_walk_2",
    "side_walk_3",
    "side_walk_4",
    "side_walk_5",
  ]),
};
