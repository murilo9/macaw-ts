import type { GameEvents } from "../../game/GameEvents";

type GameEventHandler<K extends keyof GameEvents> = (
  ...args: Parameters<GameEvents[K]>
) => void;

export function wireEmit<K extends keyof GameEvents>(
  emit: GameEvents,
  eventName: K,
  listeners: Array<GameEvents[K]>,
) {
  const handlers = listeners as Array<GameEventHandler<K>>;
  emit[eventName] = ((...args: Parameters<GameEvents[K]>) => {
    for (const listener of handlers.slice()) listener(...args);
  }) as GameEvents[K];
}
