import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  AfterViewInit,
  ViewChild
} from "@angular/core";
import { EntityEvent, Entity } from "./ng-konva/stage/entity/entity";
import * as Konva from "konva";
import { EntityComponent } from "./ng-konva/stage/entity/entity.component";
import { AnnotationComponent } from "./annotation/annotation.component";
import { ImageComponent } from "./ng-konva/stage/image/image.component";
import { StageComponent } from "./ng-konva/stage/stage/stage.component";
import Quad from "./models/quad";
import { LayerComponent } from "./ng-konva/stage/layer/layer.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChildren(AnnotationComponent)
  annotations: QueryList<AnnotationComponent>;

  @ViewChild(ImageComponent) image: ImageComponent;
  @ViewChild(StageComponent) stage: StageComponent;

  colors = ["#1abc9c", "#3498db", "#9b59b6", "#f1c40f", "#e67e22", "#ecf0f1"];

  color(idx: number) {
    const colorIdx = idx % (this.colors.length - 1);
    return this.colors[colorIdx];
  }

  radius = 20;
  draggable = true;

  annotationTracker = [];

  imageZIndex = 0;

  title = "app";

  ngOnInit(): void {}

  addAnnotation() {
    this.annotationTracker.push(this.annotationTracker.length + 1);
  }

  stageInit() {
    console.log("Stage init done");
    this.imageZIndex = -10;
    this.resetView();
  }

  resetView() {
    const stageWidth = this.stage.get("width");
    const stageHeight = this.stage.get("height");
    const imageWidth = this.image.get("width");
    const imageHeight = this.image.get("height");
    const imageLayer = this.image.layer.getAttr(
      Entity.COMPONENT_KEY
    ) as LayerComponent;
    imageLayer.resetZoom();
    imageLayer.set("x", stageWidth / 2 - imageWidth / 2);
    imageLayer.set("y", stageHeight / 2 - imageHeight / 2);
  }

  nodeClicked(event: EntityEvent) {
    console.log("Click");
    if (!event.sender) return;
    event.sender["fill"] = Konva.Util.getRandomColor();
  }

  imagePostInit() {}

  annotationPostInit(ev) {
    const annot = ev.sender as AnnotationComponent;
    const x = this.image.get("x");
    const y = this.image.get("y");

    const width = this.image.get("width");
    const height = this.image.get("height");

    annot.set("x", width / 2 - x);
    annot.set("y", height / 2 - y);
  }

  annotationDoubleClicked(event) {
    if (!event.sender) return;
    const annotation = event.sender as AnnotationComponent;

    const val = prompt("Enter annotation text");
    if (val) {
      annotation.note = val;
    }
  }

  ngAfterViewInit(): void {
    this.annotationsChanged();
    this.annotations.changes.subscribe(this.annotationsChanged.bind(this));
  }

  annotationsChanged() {
    console.log(`Annotations changed ${this.annotations.length}`);
  }

  constructor() {}
}
