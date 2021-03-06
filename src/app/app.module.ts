import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";

import { AnnotationComponent } from "./annotation/annotation.component";
import { NgKonvaModule } from "./ng-konva/ng-konva.module";

@NgModule({
  declarations: [AppComponent, AnnotationComponent],
  imports: [BrowserModule, FormsModule, NgKonvaModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
