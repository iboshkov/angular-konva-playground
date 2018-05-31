import { Component, OnInit, QueryList, ViewChildren, AfterViewInit, ContentChildren } from '@angular/core';
import * as Konva from 'konva';
import { EntityComponent } from '../entity/entity.component';
import { Entity } from '../entity/entity';
import { LayerComponent } from '../layer/layer.component';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit, AfterViewInit {
  layer: Konva.Layer;
  stage: Konva.Stage;
  circle: Konva.Circle;
  @ContentChildren(LayerComponent) layers: QueryList<LayerComponent>;

  constructor() { }

  ngAfterViewInit() {
    console.log(`We have ${this.layers.length} layers`);
    this.syncChildren();
    this.layers.changes.subscribe(this.syncChildren.bind(this));
    console.log(this.stage);
  }

  syncChildren() {
    this.layers.forEach(async (layer) => {
      layer.stage = this.stage;
      if (!layer.initialized) {
        await layer.init();
        this.stage.add(layer.layer);
      }
    });
  }

  ngOnInit() {
    this.stage = new Konva.Stage({
      container: 'container',   // id of container <div>
      width: 1024,
      height: 1024
    });

    this.layer = new Konva.Layer();
  }

}
