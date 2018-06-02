import { Component, Input, OnInit, forwardRef } from "@angular/core";
import { Entity } from "../entity/entity";
import { KonvaAutoBind } from "../../decorators";
import * as Konva from "konva";
import { Shape } from "../shape/shape";

const rectProps = ["cornerRadius"];

@Component({
  selector: "konva-rect",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./rect.component.css"],
  providers: [{ provide: Entity, useExisting: forwardRef(() => RectComponent) }]
})
@KonvaAutoBind(Konva.Rect.prototype, [], rectProps)
export class RectComponent extends Shape implements OnInit {
  node: Konva.Rect;

  public async init() {
    this.node = new Konva.Rect({
      x: 0,
      y: 0,
      fill: "black"
    });
    await super.init();
  }

  constructor() {
    super();
  }

  ngOnInit() {}
}
