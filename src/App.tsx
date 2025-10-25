import { useEffect, useRef } from "react";
import { Game } from "./core/Game";
import { Room } from "./core/room/Room";
import type { GameConfig } from "./core/GameConfig";

const gameConfig: GameConfig = {
  initialRoom: new Room([]),
  canvas: {
    background: "#aaaaaa",
    width: 640,
    height: 480,
  },
};

function App() {
  // Warning: ref may be problematic  when we want to make reactive changes to the UI
  const game = useRef<Game>(new Game(gameConfig));

  // Warning: useLayoutEffect may be more adequate than useEffect
  useEffect(() => {
    game.current.start();
    return game.current.stop();
  }, []);

  return <></>;
}

export default App;
