import { useState } from "react";
import { useGameEmit, useGameEvent } from "../../core/useGameEvent";

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
      {dialogText ? (
        <div>
          <p>{dialogText}</p>
          <button onClick={() => emit["dialog:close"]()}>Close</button>
        </div>
      ) : null}
    </div>
  );
}
