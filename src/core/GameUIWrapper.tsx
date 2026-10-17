import type { ReactNode } from "react";

type GameUIWrapperProps = {
  children: ReactNode;
  width: string;
  height: string;
};

export default function GameUiWrapper({
  children,
  width,
  height,
}: GameUIWrapperProps) {
  return (
    <div
      id="game-ui"
      className="absolute top-0 left-0"
      style={{ width, height }}
    >
      {children}
    </div>
  );
}
