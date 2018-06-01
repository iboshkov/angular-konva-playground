import { Component, Input, OnInit, forwardRef } from "@angular/core";
import { Entity, KonvaBind, NodeBinding } from "../entity/entity";
import * as Konva from "konva";
import { Shape } from "../shape/shape";

@Component({
  selector: "konva-circle",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./circle.component.css"],
  providers: [
    { provide: Entity, useExisting: forwardRef(() => CircleComponent) }
  ]
})
@KonvaBind(Konva.Circle.prototype)
export class CircleComponent extends Shape implements OnInit {
  node: Konva.Circle;

  public async init() {
    this.node = new Konva.Circle({
      x: 0, //this.stage.getWidth() / 2,
      y: 0, //this.stage.getHeight() / 2,
      radius: this.get("radius"),
      fill: this.get("fill"),
      stroke: "black",
      strokeWidth: 4
    });

    await super.init();
  }

  constructor() {
    super();
  }

  ngOnInit() {}
}
