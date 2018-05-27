import { Component, OnInit, Input, AfterViewInit, forwardRef } from '@angular/core';
import * as Konva from 'konva';
import { nameof } from '../../../utils';
import { Entity } from './entity';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css'],
  providers: [{provide: Entity, useExisting: forwardRef(() => EntityComponent)}]
})
export class EntityComponent extends Entity implements OnInit {
  textShape: Konva.Text;
  circle: Konva.Circle;

  @Input() stage: Konva.Stage;
  @Input() layer: Konva.Layer;

  get node() { return this.circle; }

  constructor() { super() }

  ngOnInit() {
  }

  public init() {
    console.log('Stage set');
    // if (!this.layer) this.layer = this.stage.getLayer();
    
    // create our shape
    this.circle = new Konva.Circle({
      x: this.stage.getWidth() / 2,
      y: this.stage.getHeight() / 2,
      radius: 70,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4
    });

    this.textShape = new Konva.Text({
      x: this.circle.x() - this.circle.radius(),
      y: this.circle.y() - 15,
      text: '123',
      fontSize: 30,
      fontFamily: 'Calibri',
      width: this.circle.radius() * 2,
      align: 'center',
      fill: 'green'
    });

    var group = new Konva.Group();
    group.add(this.circle);
    group.add(this.textShape);
    group.draggable(true);

    this.layer.add(group);
  }

}
