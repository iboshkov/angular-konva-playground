import { Entity, KonvaBind } from "../entity/entity";
import * as Konva from "konva";

@KonvaBind(Konva.Shape.prototype, [], ["fill", "stroke", "strokeWidth"])
export class Shape extends Entity {}
