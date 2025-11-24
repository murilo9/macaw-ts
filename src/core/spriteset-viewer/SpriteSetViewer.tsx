import { useState } from "react";
import { spriteSets } from "../../game/spritesets";
import SpriteSetTileRenderer from "./SpriteSetTileRenderer";

export default function SpriteSetViewer() {
  const spriteSetsList = Object.entries(spriteSets);
  const [selectedSpriteSetName, setSelectedSpriteSetName] = useState<string>(
    spriteSetsList[0][0]
  );

  return (
    <div id="spriteset-viewer" className="p-3">
      <select
        className="mb-2 border p-1"
        value={selectedSpriteSetName}
        onChange={(e) => setSelectedSpriteSetName(e.target.value)}
      >
        {spriteSetsList.map(([key]) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <SpriteSetTileRenderer
        spriteSet={spriteSets[selectedSpriteSetName as keyof typeof spriteSets]}
      />
    </div>
  );
}
