import { Component, OnInit } from "@angular/core";
import { EntityEvent, Entity } from "./scene/entity/entity";
import * as Konva from "konva";
import { EntityComponent } from "./scene/entity/entity.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  ngOnInit(): void {}

  radius = 20;
  draggable = true;

  stuff = ["Hello world"];

  fill = "red";
  text = "";
  title = "app";

  addStuff() {
    this.stuff.push(this.text);
  }

  nodeClicked(event: EntityEvent) {
    if (!event.sender) return;
    event.sender.fill = Konva.Util.getRandomColor();
  }

  /**
   *
   */
  constructor() {}
}
