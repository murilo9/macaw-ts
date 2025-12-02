import { type ReactNode, useEffect, useRef, useState } from "react";
import { Game } from "./core/Game";
import type { GameConfig } from "./core/GameConfig";
import type { InputConfig } from "./core/input/InputConfig";
import SpriteSetViewer from "./core/spriteset-viewer/SpriteSetViewer";
import { WorldRoom } from "./game/rooms/World";

// Defines whether it'll be displaed the game or a developer tool
const MODE: "game" | "spriteset_viewer" = "game";

const gameConfig: GameConfig = {
  initialRoom: new WorldRoom(),
  canvas: {
    background: "#aaaaaa",
    width: 640,
    height: 480,
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
  // Warning: ref may be problematic  when we want to make reactive changes to the UI
  const game = useRef<Game>(new Game(gameConfig, inputConfig));

  const [otherContent, setOtherContent] = useState<ReactNode | null>(null);

  // Warning: useLayoutEffect may be more adequate than useEffect
  useEffect(() => {
    switch (MODE) {
      case "game":
        game.current.start();
        return game.current.stop;
      case "spriteset_viewer":
        setOtherContent(<SpriteSetViewer />);
        break;
    }
  }, []);

  return <>{otherContent}</>;
}

export default App;
