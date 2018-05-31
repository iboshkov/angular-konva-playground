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
  selector: "app-layer",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./layer.component.css"],
  providers: [
    { provide: Entity, useExisting: forwardRef(() => LayerComponent) }
  ]
})
@KonvaBind(Konva.Layer, ["beforeDraw"])
export class LayerComponent extends Entity implements OnInit {
  initialized = false;

  @ContentChildren(Entity) entities: QueryList<Entity>;
  @ViewChildren(Entity) viewEntities: QueryList<Entity>;
  
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
    this.entities.changes.subscribe(() => this.syncChildren(this.entities));
    this.entities.changes.subscribe(() => this.syncChildren(this.viewEntities));
    this.syncChildren(this.entities);
    this.syncChildren(this.viewEntities);
    // this.layer.on('beforeDraw', function() {
    //   console.log("Before draw");
    // });
    await super.init();
  }

  addChild(child) {
    this.node.add(child.node);
    this.node.draw();    
  }

  public syncChildren(entities) {
    entities.forEach(async ent => {
      if (!ent.initialized && ent !== this) {
        ent.stage = this.stage;
        if (!(ent instanceof LayerComponent)) {
          ent.layer = this.node;
        }
        await ent.init()
        this.addChild(ent);
      }
    });
  }

  public async initChildren() {}
}
