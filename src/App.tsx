import { useEffect, useRef, useState } from "react";
import { Game } from "./core/Game";
import { Room } from "./core/room/Room";
import type { GameConfig } from "./core/GameConfig";

const gameConfig: GameConfig = {
  initialRoom: new Room([]),
};

function App() {
  const game = useRef<Game>(new Game(gameConfig));

  useEffect(() => {
    game.current.start();
    return game.current.stop();
  }, []);

  return (
    <>
      <h1>Macaw-TS</h1>
    </>
  );
}

export default App;
