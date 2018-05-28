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
@KonvaBind(Konva.Rect.prototype)
export class RectComponent extends Shape implements OnInit {
  node: Konva.Rect;

  @NodeBinding("draggable")
  @Input()
  public draggable = true;

  public init() {
    this.node = new Konva.Rect({
      x: 0, //this.stage.getWidth() / 2,
      y: 0, //this.stage.getHeight() / 2,
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth
    });
    this.node.draggable(this.draggable);
    setInterval(() => {
      const x = this.node["x"];
      // x.apply(this.node, [x.apply(this.node) - 1]);
      this.node.getLayer().draw();
    }, 100);
    super.init();
  }

  constructor() {
    super();
  }

  ngOnInit() {}
}
