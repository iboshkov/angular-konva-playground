import {
  Component,
  Input,
  OnInit,
  forwardRef,
  ContentChild,
  AfterContentInit,
  QueryList,
  ContentChildren
} from "@angular/core";
import { Entity, KonvaBind, NodeBinding } from "../entity/entity";
import * as Konva from "konva";
import { Shape } from "../shape/shape";

const transformerProps = ["attachTo"];

@Component({
  selector: "app-transformer",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./transformer.component.css"],
  providers: [
    { provide: Entity, useExisting: forwardRef(() => TransformerComponent) }
  ]
})
@KonvaBind(Konva.Transformer.prototype, [], [])
export class TransformerComponent extends Entity implements OnInit {
  node: Konva.Transformer;
  @ContentChildren(Entity) entities: QueryList<Entity>;
  public init() {
    this.node = new Konva.Transformer({
      x: 0,
      y: 0
    });
    this.node.draggable(this.draggable);
    this.entities.changes.subscribe(this.syncChildren.bind(this));
    this.syncChildren();
    super.init();
  }

  public syncChildren() {
    this.entities.filter(ent => ent !== this).forEach(ent => {
      if (!ent.initialized) {
        ent.stage = this.stage;
        ent.layer = this.layer;
        ent.init();
        this.layer.add(ent.node);
        this.node.attachTo(ent.node);
      }
    });
    this.layer.draw();
  }

  constructor() {
    super();
  }

  ngOnInit() {}
}
