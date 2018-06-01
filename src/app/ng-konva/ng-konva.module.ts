import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StageComponent } from './scene/scene/stage.component';
import { EntityComponent } from './scene/entity/entity.component';
import { LayerComponent } from './scene/layer/layer.component';
import { CircleComponent } from './scene/circle/circle.component';
import { TextComponent } from './scene/text/text.component';
import { GroupComponent } from './scene/group/group.component';
import { RectComponent } from './scene/rect/rect.component';
import { TransformerComponent } from './scene/transformer/transformer.component';
import { LineComponent } from './scene/line/line.component';
import { ImageComponent } from './scene/image/image.component';
import { FormsModule } from '@angular/forms';

const components = [
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
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [...components],
  exports: [...components]
})
export class NgKonvaModule { }
