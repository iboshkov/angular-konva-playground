import { Component, Input, OnInit, forwardRef } from "@angular/core";
import { Entity, KonvaBind, NodeBinding } from "../entity/entity";
import * as Konva from "konva";

@Component({
  selector: "app-circle",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./circle.component.css"],
  providers: [
    { provide: Entity, useExisting: forwardRef(() => CircleComponent) }
  ]
})
@KonvaBind(Konva.Circle.prototype, [], ["fill", "stroke"])
export class CircleComponent extends Entity implements OnInit {
  node: Konva.Circle;

  @NodeBinding("draggable")
  @Input()
  public draggable = true;

  public init() {
    console.log(this.fill);
    this.node = new Konva.Circle({
      x: 0, //this.stage.getWidth() / 2,
      y: 0, //this.stage.getHeight() / 2,
      radius: this.radius,
      fill: this.fill,
      stroke: "black",
      strokeWidth: 4
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
