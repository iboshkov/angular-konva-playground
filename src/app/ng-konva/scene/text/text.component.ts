import { Component, Input, OnInit, forwardRef } from "@angular/core";
import { Entity, KonvaBind, NodeBinding } from "../entity/entity";
import * as Konva from "konva";
import { Shape } from "../shape/shape";

@Component({
  selector: "konva-text",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./text.component.css"],
  providers: [{ provide: Entity, useExisting: forwardRef(() => TextComponent) }]
})
@KonvaBind(Konva.Text.prototype)
export class TextComponent extends Shape implements OnInit {
  node: Konva.Text;

  public async init() {
    this.node = new Konva.Text({
      x: 0,
      y: 0,
      text: this.get("text"),
      fill: this.get("fill")
    });

    await super.init();
  }

  constructor() {
    super();
  }

  ngOnInit() {}
}
