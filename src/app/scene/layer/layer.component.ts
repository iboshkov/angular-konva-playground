import {
  Component,
  OnInit,
  Input,
  ContentChildren,
  QueryList,
  AfterViewInit
} from "@angular/core";
import * as Konva from "konva";
import { Entity, KonvaBind } from "../entity/entity";

@Component({
  selector: "app-layer",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./layer.component.css"]
})
@KonvaBind(Konva.Layer)
export class LayerComponent extends Entity implements OnInit {
  initialized = false;

  @ContentChildren(Entity) entities: QueryList<Entity>;
  constructor() {
    super();
  }

  ngOnInit() {}

  @Input() stage: Konva.Stage;
  layer: Konva.Layer;

  public get node() {
    return this.layer;
  }

  public init() {
    this.layer = new Konva.Layer();
    this.entities.changes.subscribe(this.syncChildren.bind(this));
    this.syncChildren();
  }

  public syncChildren() {
    this.entities.forEach(ent => {
      if (!ent.initialized) {
        ent.stage = this.stage;
        ent.layer = this.layer;
        ent.init();
        this.layer.add(ent.node);
      }
    });
    this.layer.draw();
  }

  public initChildren() {}
}
