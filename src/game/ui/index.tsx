import { useState } from "react";
import { useGameEmit, useGameEvent } from "../../core/useGameEvent";
import { useGameValue } from "../../core/useGameValue";

export default function GameUI() {
  const emit = useGameEmit();
  const [dialogText, setDialogText] = useState<string | null>(null);

  useGameEvent("dialog:display", (payload) => {
    setDialogText(payload.text);
  });
  useGameEvent("dialog:close", () => {
    setDialogText(null);
  });

  return (
    <div>
      <h1>This is the Game UI</h1>
      <RatPosition />
      {dialogText ? (
        <div>
          <p>{dialogText}</p>
          <button onClick={() => emit["dialog:close"]()}>Close</button>
        </div>
      ) : null}
    </div>
  );
}

function RatPosition() {
  const position = useGameValue("rat:position");

  return (
    <p>
      {position.x.toFixed(0)}, {position.y.toFixed(0)}
    </p>
  );
}
