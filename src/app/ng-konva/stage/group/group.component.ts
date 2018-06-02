import {
  Component,
  Input,
  OnInit,
  ContentChildren,
  QueryList,
  forwardRef
} from "@angular/core";
import { Entity } from "../entity/entity";
import * as Konva from "konva";
import { KonvaAutoBind } from "../../decorators";

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
@KonvaAutoBind(Konva.Group.prototype)
export class GroupComponent extends Entity {
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
}
