import { useCallback, useContext, useSyncExternalStore } from "react";
import type { GameValues } from "../game/GameValues";
import { GameValuesContext } from "./gameValuesContext";

export function useGameValue<K extends keyof GameValues>(
  key: K,
): GameValues[K] {
  const store = useContext(GameValuesContext);
  if (!store) {
    throw new Error("useGameValue must be used within GameValuesProvider");
  }

  const subscribe = useCallback(
    (listener: () => void) => store.subscribe(key, listener),
    [store, key],
  );
  const getSnapshot = useCallback(() => store.get(key), [store, key]);

  return useSyncExternalStore(subscribe, getSnapshot);
}
