import { useEffect, useRef } from "react";
import type { SpriteSet } from "../sprite/SpriteSet";

// TODO: continue improving this tool
export default function SpriteSetTileRenderer({
  spriteSet,
}: {
  spriteSet: SpriteSet;
}) {
  const container = useRef<HTMLDivElement | null>(null);
  const showTilesNames = true;

  return (
    <div style={{ position: "relative" }} ref={container}>
      <img src={spriteSet.img.src} alt="Image" />
      {Object.entries(spriteSet.tiles).map(([tileName, tile], index) => (
        <div
          className="absolute"
          style={{
            left: tile.xOrigin,
            top: tile.yOrigin,
            width: tile.width + "px",
            height: tile.height + "px",
            border: "1px solid pink",
          }}
        >
          {showTilesNames ? (
            <p
              className={`absolute ${
                index % 2 === 0 ? "text-pink-500" : "text-pink-800"
              }`}
              style={{
                top: Math.round(tile.height) + (index % 2 === 0 ? 0 : 8) + "px",
                fontSize: "8px",
              }}
            >
              {tileName}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
