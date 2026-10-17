import type { GameEventOn, GameEvents } from "../../game/GameEvents";

export function wireOn<K extends keyof GameEvents>(
  on: GameEventOn,
  eventName: K,
  listeners: Array<GameEvents[K]>,
) {
  on[eventName] = ((newListener: GameEvents[K]) => {
    listeners.push(newListener);
    return () => {
      const index = listeners.indexOf(newListener);
      if (index !== -1) listeners.splice(index, 1);
    };
  }) as GameEventOn[K];
}
