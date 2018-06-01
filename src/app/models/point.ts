export default class Point {
  constructor(public x = 0, public y = 0) {}
  public toString = (): string => {
    return `Point(${this.x}, ${this.y})`;
  };
}
