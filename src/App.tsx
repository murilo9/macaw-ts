import { useEffect, useRef } from "react";
import { Game } from "./core/Game";
import { Room } from "./core/room/Room";
import type { GameConfig } from "./core/GameConfig";
import type { InputConfig } from "./core/input/InputConfig";
import { LumberjackJackSpriteSet } from "./game/spritesets/lumberjack-jack";

const gameConfig: GameConfig = {
  initialRoom: new Room([], { lumberjacjJack: LumberjackJackSpriteSet }),
  canvas: {
    background: "#aaaaaa",
    width: 640,
    height: 480,
  },
};

const inputConfig: InputConfig = {
  axis1: {
    down: "s",
    left: "a",
    right: "d",
    up: "w",
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

  // Warning: useLayoutEffect may be more adequate than useEffect
  useEffect(() => {
    game.current.start();
    return game.current.stop();
  }, []);

  return <></>;
}

export default App;
