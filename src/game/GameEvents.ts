/**
 * Here you have to define all game's events and their respective payloads.
 */
export class GameEvents {
  public "dialog:display" = function (payload: { text: string }) {};
  public "dialog:close" = function () {};
}

export type GameEventListeners = {
  [K in keyof GameEvents]: Array<GameEvents[K]>;
};

export type GameEventOn = {
  [K in keyof GameEvents]: (listener: GameEvents[K]) => () => void;
};

export type GameEventChannel = {
  emit: GameEvents;
  on: GameEventOn;
};
