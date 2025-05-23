// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BlogViewerComponent } from './components/blog-viewer/blog-viewer.component'; // Importa el nuevo componente

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BlogViewerComponent // Importa el componente standalone aquí
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }