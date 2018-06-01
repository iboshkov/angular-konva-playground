import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StageComponent } from "./stage/stage/stage.component";
import { EntityComponent } from "./stage/entity/entity.component";
import { LayerComponent } from "./stage/layer/layer.component";
import { CircleComponent } from "./stage/circle/circle.component";
import { TextComponent } from "./stage/text/text.component";
import { GroupComponent } from "./stage/group/group.component";
import { RectComponent } from "./stage/rect/rect.component";
import { TransformerComponent } from "./stage/transformer/transformer.component";
import { LineComponent } from "./stage/line/line.component";
import { ImageComponent } from "./stage/image/image.component";
import { FormsModule } from "@angular/forms";
import { DebugComponent } from "./stage/debug/debug.component";

const components = [
  DebugComponent,
  StageComponent,
  EntityComponent,
  LayerComponent,
  CircleComponent,
  TextComponent,
  GroupComponent,
  RectComponent,
  LineComponent,
  ImageComponent,
  TransformerComponent
];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [...components],
  exports: [...components]
})
export class NgKonvaModule {}
