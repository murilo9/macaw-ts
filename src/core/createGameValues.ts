import type { GameValues } from "../game/GameValues";

type GameValueSnapshots = {
  [K in keyof GameValues]: GameValues[K];
};

export type GameValuesReader = {
  get<K extends keyof GameValues>(key: K): GameValues[K];
  subscribe<K extends keyof GameValues>(
    key: K,
    listener: () => void,
  ): () => void;
};

export type GameValuesStore = GameValuesReader & {
  set<K extends keyof GameValues>(key: K, value: GameValues[K]): void;
};

export function createGameValues(initial: GameValues): GameValuesStore {
  const snapshots = {} as GameValueSnapshots;
  const listeners = {} as {
    [K in keyof GameValues]: Array<() => void>;
  };

  for (const key of Object.keys(initial) as (keyof GameValues)[]) {
    storeSnapshot(snapshots, key, initial[key]);
    listeners[key] = [];
  }

  return {
    get(key) {
      return snapshots[key];
    },
    set(key, value) {
      // Short-circutis if the value did not change, so listeners are not called
      if (Object.is(snapshots[key], value)) return;
      // Updates the snapshot value
      storeSnapshot(snapshots, key, value);
      // Calls all subscribed listeners
      for (const listener of listeners[key].slice()) listener();
    },
    subscribe(key, listener) {
      listeners[key].push(listener);
      return () => {
        const index = listeners[key].indexOf(listener);
        if (index !== -1) listeners[key].splice(index, 1);
      };
    },
  };
}

function storeSnapshot<K extends keyof GameValues>(
  snapshots: GameValueSnapshots,
  key: K,
  value: GameValues[K],
) {
  snapshots[key] = Object.freeze(value);
}
