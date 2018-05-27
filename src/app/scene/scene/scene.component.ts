import { Component, OnInit, QueryList, ViewChildren, AfterViewInit, ContentChildren } from '@angular/core';
import * as Konva from 'konva';
import { EntityComponent } from '../entity/entity.component';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit, AfterViewInit {
  layer: Konva.Layer;
  stage: Konva.Stage;
  circle: Konva.Circle;
  @ContentChildren(EntityComponent) entities: QueryList<EntityComponent>;

  constructor() { }

  ngAfterViewInit() {
    console.log(`We have ${this.entities.length} entities`);
    this.entities.forEach(ent => {
      console.log("Setting stage for entity");
      ent.stage = this.stage;
      ent.layer = this.layer;
      ent.init();
    });
    this.stage.add(this.layer);
  }

  ngOnInit() {
    this.stage = new Konva.Stage({
      container: 'container',   // id of container <div>
      width: 500,
      height: 500
    });

    this.layer = new Konva.Layer();
  }

}
