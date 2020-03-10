import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SortingVisualiserComponent } from './visualiser/sorting-visualiser.component';

const routes: Routes = [
  {path:"",component:SortingVisualiserComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
