import { Component, Input, OnInit, forwardRef } from "@angular/core";
import { Entity } from "../entity/entity";
import { KonvaAutoBind } from "../../decorators";
import * as Konva from "konva";
import { Shape } from "../shape/shape";

const lineProps = ["points", "closed"];

@Component({
  selector: "konva-line",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./line.component.css"],
  providers: [{ provide: Entity, useExisting: forwardRef(() => LineComponent) }]
})
@KonvaAutoBind(Konva.Line.prototype, [], lineProps)
export class LineComponent extends Shape implements OnInit {
  node: Konva.Line;

  public async init() {
    this.node = new Konva.Line({
      points: [0, 0, 100, 100]
    });
    await super.init();
  }

  constructor() {
    super();
  }

  ngOnInit() {}
}
