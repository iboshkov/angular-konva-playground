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
  selector: "konva-group",
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

  public async init() {
    this.node = new Konva.Group({
      x: 0,
      y: 0
    });
    await super.init();
    await this.initChildren();
  }

  public addChild(child) {
    this.node.add(child.node);
  }


  constructor() {
    super();
  }

  ngOnInit() {}
}
