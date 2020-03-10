import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SortingVisualiserComponent } from './visualiser/sorting-visualiser.component';
import { StoreModule } from '@ngrx/store';
import { visualiserReducer } from './visualiser/store/visualiser.reducer';

@NgModule({
  declarations: [
    AppComponent,
    SortingVisualiserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({visualiser: visualiserReducer})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
