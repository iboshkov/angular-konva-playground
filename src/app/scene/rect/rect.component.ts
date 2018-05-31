import { Component, Input, OnInit, forwardRef } from "@angular/core";
import { Entity, KonvaBind, NodeBinding } from "../entity/entity";
import * as Konva from "konva";
import { Shape } from "../shape/shape";

const rectProps = ["cornerRadius"];

@Component({
  selector: "app-rect",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./rect.component.css"],
  providers: [{ provide: Entity, useExisting: forwardRef(() => RectComponent) }]
})
@KonvaBind(Konva.Rect.prototype, [], rectProps)
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
