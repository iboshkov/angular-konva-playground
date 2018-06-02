import { Entity } from "../entity/entity";
import * as Konva from "konva";
import { KonvaAutoBind } from "../../decorators";

@KonvaAutoBind(Konva.Shape.prototype, [], ["fill", "stroke", "strokeWidth"])
export class Shape extends Entity {}
