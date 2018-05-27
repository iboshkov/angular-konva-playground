import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { Entity, KonvaBind, NodeBinding } from '../entity/entity';
import * as Konva from 'konva';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.css'],
  providers: [{provide: Entity, useExisting: forwardRef(() => CircleComponent)}]
})
@KonvaBind(Konva.Circle.prototype)
export class CircleComponent extends Entity implements OnInit {
  node: Konva.Circle;

  @NodeBinding('fill')
  @Input()
  public fill = 'red';

  @NodeBinding('draggable')
  @Input()
  public draggable = true;

  public init() {
    console.log(this.fill);
    this.node = new Konva.Circle({
      x: this.stage.getWidth() / 2,
      y: this.stage.getHeight() / 2,
      radius: this.radius,
      fill: this.fill,
      stroke: 'black',
      strokeWidth: 4
    });
    this.node.draggable(this.draggable);

    super.init();
  }

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
