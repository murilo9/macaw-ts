import { useContext, useEffect, useRef } from "react";
import type { GameEvents } from "../game/GameEvents";
import { GameEventsContext } from "./gameEventsContext";

function useGameEventChannel() {
  const channel = useContext(GameEventsContext);
  if (!channel) {
    throw new Error("Game event hooks must be used within GameEventsProvider");
  }
  return channel;
}

export function useGameEmit() {
  return useGameEventChannel().emit;
}

export function useGameEvent<K extends keyof GameEvents>(
  eventName: K,
  listener: GameEvents[K],
) {
  const channel = useGameEventChannel();
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    const handler = ((...args: Parameters<GameEvents[K]>) => {
      const current = listenerRef.current as (
        ...args: Parameters<GameEvents[K]>
      ) => void;
      current(...args);
    }) as GameEvents[K];
    const subscribe = channel.on[eventName] as (
      listener: GameEvents[K],
    ) => () => void;
    return subscribe(handler);
  }, [channel, eventName]);
}
