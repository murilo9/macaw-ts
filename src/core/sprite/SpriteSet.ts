export type TileDef = [
  xOrigin: number,
  yOrigin: number,
  xEnd: number,
  yEnd: number
];

export class SpriteSet {
  img: HTMLImageElement;
  tiles: Record<string, TileDef>;

  constructor(img: HTMLImageElement, tiles: Record<string, TileDef>) {
    this.img = img;
    this.tiles = tiles;
  }
}
