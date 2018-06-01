import {
  Component,
  OnInit,
  Input,
  ContentChildren,
  QueryList,
  AfterViewInit,
  forwardRef,
  ViewChildren
} from "@angular/core";
import * as Konva from "konva";
import { Entity, KonvaBind } from "../entity/entity";

@Component({
  selector: "konva-layer",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./layer.component.css"],
  providers: [
    { provide: Entity, useExisting: forwardRef(() => LayerComponent) }
  ]
})
@KonvaBind(Konva.Layer, ["beforeDraw", "draw"])
export class LayerComponent extends Entity implements OnInit {
  initialized = false;
  
  constructor() {
    super();
  }

  ngOnInit() {}

  @Input() stage: Konva.Stage;
  node: Konva.Layer;

  public get layer() {
    return this.node;
  }

  public async init() {
    this.node = new Konva.Layer();

    // this.layer.on('beforeDraw', function() {
    //   console.log("Before draw");
    // });
    await super.init();
    await this.initChildren();
  }

  addChild(child) {
    this.node.add(child.node);
  }
}
