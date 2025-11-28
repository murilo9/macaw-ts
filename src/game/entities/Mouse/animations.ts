import { Animation } from "../../../core/entity/interfaces/Animation";
import { spriteSets } from "../../spritesets";

const SPEED = 6;

export const mouseAnimations = {
  idle: new Animation(spriteSets.Mouse0SpriteSet, SPEED, [
    "idle_0",
    "idle_1",
    "idle_2",
    "idle_3",
    "idle_4",
    "idle_5",
  ]),
  walking: new Animation(spriteSets.Mouse0SpriteSet, SPEED, [
    "walk_0",
    "walk_1",
    "walk_2",
    "walk_3",
    "walk_4",
    "walk_5",
  ]),
  eating: new Animation(spriteSets.Mouse0SpriteSet, SPEED, [
    "eat_0",
    "eat_1",
    "eat_2",
    "eat_3",
    "eat_4",
    "eat_5",
    "eat_6",
    "eat_7",
    "eat_8",
    "eat_9",
  ]),
};
