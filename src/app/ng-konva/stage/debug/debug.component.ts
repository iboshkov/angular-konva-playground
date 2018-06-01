import { Component, Input, OnInit, forwardRef } from "@angular/core";
import { Entity, KonvaBind, NodeBinding } from "../entity/entity";
import * as Konva from "konva";
import { Shape } from "../shape/shape";

@Component({
  selector: "konva-debug",
  templateUrl: "../debug/debug.component.html"
})
export class DebugComponent implements OnInit {
  @Input() public component: Entity;

  ngOnInit(): void {}
}
