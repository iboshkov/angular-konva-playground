import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as Konva from 'konva';
import { nameof } from '../../../utils';

const drawableKey = Symbol('drawable');
function drawableProperty(obj: string, fn = 'text') {
  function actualDecorator(target, name) {
    Object.defineProperty(target, name, {
      get: function() {
        const drawable = this[obj];
        const val = this['_' + name];
        if (drawable) {
          const fnToCall = drawable[fn] as Function;
          if (fnToCall) {
            fnToCall.apply(drawable, [val]);
          }
          drawable.getStage().draw();
        }
        return val;
      },
      set: function(value) { this['_' + name] = value; },
      enumerable: true,
      configurable: true
    });
  }

  return actualDecorator;
}

function getFormat(target: any, propertyKey: string) {
    return Reflect.getMetadata(drawableKey, target, propertyKey);
}


@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {
  textShape: Konva.Text;
  circle: Konva.Circle;

  @drawableProperty(nameof<EntityComponent>('textShape'))
  text = 'test';

  @drawableProperty(nameof<EntityComponent>('circle'), 'radius')
  width = 60;

  @Input() stage: Konva.Stage;
  @Input() layer: Konva.Layer;
  constructor() { }

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
      text: this.text,
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
