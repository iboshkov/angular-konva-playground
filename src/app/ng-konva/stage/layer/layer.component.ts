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
import { Entity } from "../entity/entity";
import { KonvaAutoBind } from "../../decorators";

@Component({
  selector: "konva-layer",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./layer.component.css"],
  providers: [
    { provide: Entity, useExisting: forwardRef(() => LayerComponent) }
  ]
})
@KonvaAutoBind(Konva.Layer, ["beforeDraw", "draw"])
export class LayerComponent extends Entity implements OnInit {
  initialized = false;

  constructor() {
    super();
  }

  ngOnInit() {}

  @Input() stage: Konva.Stage;
  node: Konva.Layer;

  @Input() zoomAmount = 1.1;

  @Input() zoomEnabled = false;

  public get layer() {
    return this.node;
  }

  public async init() {
    this.node = new Konva.Layer();

    await super.init();
    await this.initChildren();
  }

  addChild(child) {
    this.node.add(child.node);
  }

  resetZoom() {
    this.layer.scale({ x: 1, y: 1 });
  }

  onWheel(e: WheelEvent) {
    if (!this.zoomEnabled || !(e.altKey || e.metaKey)) return;
    console.log(`Zooming ${this.name}`);
    e.preventDefault();
    let oldScale = this.layer.scaleX();

    let mousePointTo = {
      x:
        this.stage.getPointerPosition().x / oldScale -
        this.layer.x() / oldScale,
      y:
        this.stage.getPointerPosition().y / oldScale - this.layer.y() / oldScale
    };

    let newScale =
      e.deltaY > 0 ? oldScale * this.zoomAmount : oldScale / this.zoomAmount;
    this.layer.scale({ x: newScale, y: newScale });

    let newPos = {
      x:
        -(mousePointTo.x - this.stage.getPointerPosition().x / newScale) *
        newScale,
      y:
        -(mousePointTo.y - this.stage.getPointerPosition().y / newScale) *
        newScale
    };
    this.layer.position(newPos);
    this.layer.batchDraw();
  }
}
