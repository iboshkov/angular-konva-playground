import Point from "./point";

export default class Quad {
  constructor(
    public topLeft = new Point(),
    public topRight = new Point(),
    public bottomLeft = new Point(),
    public bottomRight = new Point()
  ) {}

  public toString = (): string => {
    return `Quad (${this.topLeft}, ${this.topRight}, ${this.bottomLeft}, ${
      this.bottomRight
    })`;
  };
}
