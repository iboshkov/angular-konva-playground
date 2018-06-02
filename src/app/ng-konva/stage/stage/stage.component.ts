import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  AfterViewInit,
  ContentChildren,
  Input,
  ViewChild,
  Query,
  ElementRef,
  HostListener
} from "@angular/core";
import * as Konva from "konva";
import { EntityComponent } from "../entity/entity.component";
import { Entity } from "../entity/entity";
import { LayerComponent } from "../layer/layer.component";
import { KonvaAutoBind } from "../../decorators";

@Component({
  selector: "konva-stage",
  templateUrl: "./stage.component.html",
  styleUrls: ["./stage.component.css"]
})
@KonvaAutoBind(Konva.Stage.prototype)
export class StageComponent extends Entity implements OnInit, AfterViewInit {
  constructor() {
    super();
  }
  @ViewChild("#container") container: HTMLElement;

  get node() {
    return this.stage;
  }

  @Input() zoomAmount = 1.1;

  @Input() zoomEnabled = false;

  async ngAfterViewInit() {
    this.stage = new Konva.Stage({
      container: "container", // id of container <div>
      width: 1024,
      height: 1024
    });

    // this.stage.draggable(true);

    await this.init();
    await this.initChildren();
    this.containerResized();
    this.postInit.emit({ sender: this });
  }

  addChild(child) {
    this.stage.add(child.node);
    this.stage.draw();
  }

  @HostListener("window:resize")
  containerResized() {
    // now we need to fit stage into parent
    const containerWidth = this.container.offsetWidth;
    // to do this we need to scale the stage
    const stageWidth = this.get("width");
    const stageHeight = this.get("height");
    const scale = containerWidth / stageWidth;

    this.stage.width(stageWidth * scale);
    this.stage.height(stageHeight * scale);
    // this.stage.scale({ x: scale, y: scale });
    this.stage.draw();
  }

  onWheel(e: WheelEvent) {
    this.entities
      .filter(ent => ent.entName === LayerComponent.name)
      .forEach(layer => layer.onWheel(e));

    if (!this.zoomEnabled || !(e.altKey || e.metaKey)) return;
    e.preventDefault();
    let oldScale = this.stage.scaleX();

    let mousePointTo = {
      x:
        this.stage.getPointerPosition().x / oldScale -
        this.stage.x() / oldScale,
      y:
        this.stage.getPointerPosition().y / oldScale - this.stage.y() / oldScale
    };

    let newScale =
      e.deltaY > 0 ? oldScale * this.zoomAmount : oldScale / this.zoomAmount;
    this.stage.scale({ x: newScale, y: newScale });

    let newPos = {
      x:
        -(mousePointTo.x - this.stage.getPointerPosition().x / newScale) *
        newScale,
      y:
        -(mousePointTo.y - this.stage.getPointerPosition().y / newScale) *
        newScale
    };
    this.stage.position(newPos);
    this.stage.batchDraw();
  }

  ngOnInit() {}
}
