import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { StageComponent } from './scene/scene/stage.component';
import { EntityComponent } from './scene/entity/entity.component';
import { LayerComponent } from './scene/layer/layer.component';
import { CircleComponent } from './scene/circle/circle.component';
import { TextComponent } from './scene/text/text.component';
import { GroupComponent } from './scene/group/group.component';
import { RectComponent } from './scene/rect/rect.component';
import { TransformerComponent } from './scene/transformer/transformer.component';
import { AnnotationComponent, ControlPoint } from './annotation/annotation.component';
import { LineComponent } from './scene/line/line.component';
import { ImageComponent } from './scene/image/image.component';


@NgModule({
  declarations: [
    AppComponent,
    StageComponent,
    EntityComponent,
    LayerComponent,
    CircleComponent,
    TextComponent,
    GroupComponent,
    RectComponent,
    TransformerComponent,
    AnnotationComponent,
    ControlPoint,
    LineComponent,
    ImageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
