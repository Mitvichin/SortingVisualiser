import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BubbleSortComponent } from './components/bubble-sort/bubble-sort.component';
import { SelectionSortComponent } from './components/selection-sort/selection-sort.component';
import { QuickSortComponent } from './components/quick-sort/quick-sort.component';

const routes: Routes = [
  { path: '', component: BubbleSortComponent },
  { path: 'selection-sort', component: SelectionSortComponent },
  { path: 'quick-sort', component: QuickSortComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
