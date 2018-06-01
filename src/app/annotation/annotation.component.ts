import { Component, OnInit, forwardRef, ContentChildren, QueryList, ViewChildren, Directive } from '@angular/core';
import { LayerComponent } from '../ng-konva/scene/layer/layer.component';
import { Entity } from '../ng-konva/scene/entity/entity';
import { Layer, Line } from 'konva';
import { CircleComponent } from '../ng-konva/scene/circle/circle.component';
import { GroupComponent } from '../ng-konva/scene/group/group.component';
import { LineComponent } from '../ng-konva/scene/line/line.component';

@Directive({selector: 'control-point'})
export class ControlPoint {
}


// TODO: Don't inherit LayerComponent
@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.css'],
  providers: [
    { provide: LayerComponent, useExisting: forwardRef(() => AnnotationComponent) }
  ]
})
export class AnnotationComponent extends LayerComponent implements OnInit {
  constructor() {
    super();
    console.log("Construct annotation comp")
  }

  ngOnInit() {
  }

  public async init() {
    await super.init();
    console.log(`Children: ${this.entities.length}`);
  }

  public topLeftX = 0;
  public topLeftY = 0;
  public topRightX = 100;
  public topRightY = 0;

  public bottomLeftX = 0;
  public bottomLeftY = 100;
  public bottomRightX = 100;
  public bottomRightY = 100;

  get group() {
    return this.viewEntities && this.viewEntities.find(x => x instanceof GroupComponent);
  }

  public get globalX () {
    return (this.group && this.group.get("x")) || 0;
  }
  public get globalY () {
    return (this.group && this.group.get("y")) || 0;
  }

  public get globalTopLeftX() { return this.globalX + this.topLeftX; };
  public get globalTopLeftY() { return this.globalY + this.topLeftY; };
  public get globalTopRightX() { return this.globalX + this.topRightX; };
  public get globalTopRightY() { return this.globalY + this.topRightY; };

  public get globalBottomLeftX() { return this.globalX + this.bottomLeftX; };
  public get globalBottomLeftY() { return this.globalY + this.bottomLeftY; };
  public get globalBottomRightX() { return this.globalX + this.bottomRightX; };
  public get globalBottomRightY() { return this.globalY + this.bottomRightY; };

  drawLine(context, current, next, offset) {
    const {x: cx, y: cy} = current;
    const {x: nx, y: ny} = next;
    const {x: ox, y: oy} = offset;
    // draw quad
    context.beginPath();
    context.moveTo(cx + ox, cy + oy);

    context.lineTo(nx + ox, ny + oy);
    context.setAttr('strokeStyle', 'black');
    context.setAttr('lineWidth', 4);
    context.stroke();
  }

  public beforeDraw(evt) {
    var context = this.node.getContext();

    context.clear();

    const cp = this.viewEntities.filter(x => x instanceof CircleComponent);
    const line = this.viewEntities.find(x => x instanceof LineComponent);

    // TODO: Figure out a way to do reverse-binding
    this.topLeftX = cp[0].node.x();
    this.topLeftY = cp[0].node.y();
    this.topRightX = cp[1].node.x();
    this.topRightY = cp[1].node.y();
    this.bottomLeftX = cp[2].node.x();
    this.bottomLeftY = cp[2].node.y();
    this.bottomRightX = cp[3].node.x();
    this.bottomRightY = cp[3].node.y();

    // Temp hack
    (line.node as Line).points([this.topLeftX, this.topLeftY, 
      this.topRightX, this.topRightY, 
      this.bottomRightX, this.bottomRightY, 
      this.bottomLeftX, this.bottomLeftY, 
      this.topLeftX, this.topLeftY])
  }

  addChild(child) {
    this.stage.add(child.node);
    this.node.draw();
  }
}
