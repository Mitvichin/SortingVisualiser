import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BubbleSortComponent } from './components/bubble-sort/bubble-sort.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from './../environments/environment';
import * as fromApp from './store/app.reducer';
import { SelectionSortComponent } from './components/selection-sort/selection-sort.component';
import { QuickSortComponent } from './components/quick-sort/quick-sort.component';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { EffectsModule } from '@ngrx/effects'
import { BaseSortEffects } from './shared/base-effects/base-sort.effects';
import { ModalComponent } from './shared/components/modal/modal.component';
import { OptionsComponent } from './components/options/options.component';
import { CustomSelectComponent } from './shared/components/custom-select/custom-select.component';
import { InfoComponent } from './components/info/info.component';

@NgModule({
  declarations: [
    AppComponent,
    BubbleSortComponent,
    SelectionSortComponent,
    QuickSortComponent,
    VisualizerComponent,
    ModalComponent,
    OptionsComponent,
    CustomSelectComponent,
    InfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([BaseSortEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
