import { Component, OnInit, Input, ContentChildren, QueryList, AfterViewInit } from '@angular/core';
import * as Konva from 'konva';
import { Entity } from '../entity/entity';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent implements OnInit {
  initialized = false;

  @ContentChildren(Entity) entities: QueryList<Entity>;
  constructor() { }

  ngOnInit() {
  }

  @Input() stage: Konva.Stage;
  layer: Konva.Layer;

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

  public initChildren() {

  }

}
