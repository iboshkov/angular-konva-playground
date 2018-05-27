import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { StageComponent } from './scene/scene/stage.component';
import { EntityComponent } from './scene/entity/entity.component';
import { LayerComponent } from './scene/layer/layer.component';
import { CircleComponent } from './scene/circle/circle.component';


@NgModule({
  declarations: [
    AppComponent,
    StageComponent,
    EntityComponent,
    LayerComponent,
    CircleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
