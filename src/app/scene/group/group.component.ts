import {
  Component,
  Input,
  OnInit,
  ContentChildren,
  QueryList,
  forwardRef
} from "@angular/core";
import { Entity, KonvaBind, NodeBinding } from "../entity/entity";
import * as Konva from "konva";

@Component({
  selector: "app-group",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./group.component.css"],
  providers: [
    {
      provide: Entity,
      useExisting: forwardRef(() => GroupComponent)
    }
  ]
})
@KonvaBind(Konva.Group.prototype)
export class GroupComponent extends Entity implements OnInit {
  node: Konva.Group;
  @ContentChildren(Entity) entities: QueryList<Entity>;

  public init() {
    this.node = new Konva.Group({
      x: 100,
      y: 100
    });
    this.node.draggable(true);
    this.entities.changes.subscribe(this.syncChildren.bind(this));
    this.syncChildren();

    super.init();
  }
  public syncChildren() {
    this.entities.forEach(ent => {
      if (ent === this) return;
      if (!ent.initialized) {
        ent.stage = this.stage;
        ent.layer = this.layer;
        ent.init();
        this.node.add(ent.node);
      }
    });
    this.layer.draw();
  }
  constructor() {
    super();
  }

  ngOnInit() {}
}
