import { Component, Input, OnInit, forwardRef } from "@angular/core";
import { Entity, KonvaBind, NodeBinding } from "../entity/entity";
import * as Konva from "konva";
import { Shape } from "../shape/shape";

const imageProps = ["points", "closed"];

@Component({
  selector: "konva-image",
  templateUrl: "../debug/debug.component.html",
  styleUrls: ["./image.component.css"],
  providers: [
    { provide: Entity, useExisting: forwardRef(() => ImageComponent) }
  ]
})
@KonvaBind(Konva.Image.prototype, [], imageProps)
export class ImageComponent extends Shape implements OnInit {
  node: Konva.Image;

  @Input() public imageSrc: string | null = null;

  public async loadImage(src): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = document.createElement("img");
      img.src = src;

      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  public async init() {
    const image = await this.loadImage(this.imageSrc);

    this.node = new Konva.Image({
      image
    });
    await super.init();
    this.postInit.emit({ sender: this });
  }

  constructor() {
    super();
  }

  ngOnInit() {}
}
