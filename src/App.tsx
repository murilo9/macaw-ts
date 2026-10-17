import { type ReactNode, useEffect, useRef, useState } from "react";
import { Game } from "./core/Game";
import type { GameConfig } from "./core/GameConfig";
import type { InputConfig } from "./core/input/InputConfig";
import SpriteSetViewer from "./core/spriteset-viewer/SpriteSetViewer";
import { WorldRoom } from "./game/rooms/World";
import {
  GameEvents,
  type GameEventChannel,
  type GameEventListeners,
} from "./game/GameEvents";
import { GameEventsProvider } from "./core/GameEventsProvider";
import { GameValuesProvider } from "./core/GameValuesProvider";
import type { GameValuesReader } from "./core/createGameValues";
import GameUI from "./game/ui";
import GameUiWrapper from "./core/GameUIWrapper";

// Defines whether it'll be displaed the game or a developer tool
const MODE: "game" | "spriteset_viewer" = "game";

const gameConfig: GameConfig = {
  initialRoom: new WorldRoom(),
  canvas: {
    background: "#aaaaaa",
    width: 640,
    height: 480,
  },
  debug: {
    drawCollisionBoxes: false,
    drawSpriteBoxes: true,
    drawPivotCrosses: true,
  },
};

const inputConfig: InputConfig = {
  axis1: {
    down: "KeyS",
    left: "KeyA",
    right: "KeyD",
    up: "KeyW",
  },
  axis2: {
    down: "Down",
    left: "Left",
    right: "Right",
    up: "Up",
  },
};

function App() {
  const gameEventListeners = useRef<GameEventListeners>({
    ...Object.entries(new GameEvents()).reduce(
      (acc, entry) => ({ ...acc, [entry[0]]: [] }),
      {} as GameEventListeners,
    ),
  });
  const game = useRef<Game>(
    new Game(gameConfig, inputConfig, gameEventListeners.current),
  );
  // Extracts game events to save them on the ref
  const events = useRef<GameEventChannel>({
    emit: game.current.emit,
    on: game.current.on,
  });
  // Extracts game values to save them on the ref
  const gameValues = useRef<GameValuesReader>({
    get: game.current.values.get,
    subscribe: game.current.values.subscribe,
  });

  const [uiLayer, setUiLayer] = useState<ReactNode | null>(null);

  // Warning: useLayoutEffect may be more adequate than useEffect
  useEffect(() => {
    switch (MODE) {
      case "game":
        setUiLayer(
          <GameEventsProvider value={events.current}>
            <GameValuesProvider value={gameValues.current}>
              <GameUiWrapper
                width={`${gameConfig.canvas.width}px`}
                height={`${gameConfig.canvas.height}px`}
              >
                <GameUI />
              </GameUiWrapper>
            </GameValuesProvider>
          </GameEventsProvider>,
        );
        game.current.start();
        // Calls Game stop method when this component unmounts.
        return game.current.stop;
      case "spriteset_viewer":
        setUiLayer(<SpriteSetViewer />);
        break;
    }
  }, []);

  return uiLayer;
}

export default App;
