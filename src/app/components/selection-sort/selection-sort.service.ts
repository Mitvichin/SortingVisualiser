import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SelectionSortStep } from '../../models/selection-sort/SelectionSortStep';
import { swapElements } from '../../shared/utils/swap-elements';
import * as fromApp from '../../store/app.reducer';
import * as fromSelectionSortActions from './store/selection-sort.actions';
import { ComparedCouple } from 'src/app/models/shared/ComparedCouple';

@Injectable({
  providedIn: 'root'
})
export class SelectionSortService {
  sortingStep: SelectionSortStep;
  sortingHistory: SelectionSortStep[];

  constructor(private store: Store<fromApp.AppState>) { }

  selectionSort(arr: number[]) {
    this.sortingHistory = new Array<SelectionSortStep>();
    let tempComparedCouple: ComparedCouple;
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        tempComparedCouple = { x: arr[minIndex], y: arr[j], indexX: minIndex, indexY: j };
        
        if (arr[minIndex] > arr[j]) {
          minIndex = j;
        }
        this.sortingStep = new SelectionSortStep(i,minIndex,tempComparedCouple,false,[...arr],[...arr],false);
        this.sortingHistory.push(this.sortingStep);
      }

      tempComparedCouple = { x: arr[i], y: arr[minIndex], indexX: i, indexY: minIndex };
      this.sortingStep = new SelectionSortStep(i,minIndex, tempComparedCouple, true, [...arr], undefined, true);
      swapElements(i, minIndex, arr)
      this.sortingStep.resultArr = [...arr];
      this.sortingHistory.push(this.sortingStep);
    }

    this.store.dispatch(new fromSelectionSortActions.AddSelectionSortHistory(this.sortingHistory));
  }

}
