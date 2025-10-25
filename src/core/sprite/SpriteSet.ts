type TileDef = [xOrigin: number, yOrigin: number, xEnd: number, yEnd: number];

type TileMap = Array<TileDef>;

export class SpriteSet {
  img: HTMLImageElement;
  tileMap: TileMap;

  constructor(img: HTMLImageElement, tileMap: TileMap) {
    this.img = img;
    this.tileMap = tileMap;
  }
}
