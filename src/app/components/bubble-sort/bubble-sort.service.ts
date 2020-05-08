import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { BubbleSortStep } from '../../models/bubble-sort/BubbleSortStep';
import { swapElements } from '../../shared/utils/swap-elements';
import * as fromBubbleSortActions from './store/bubble-sort.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class BubbleSortService {
  itemsToBeChanged = new Subject<any>();
  visModel: any;
  sortingStep: BubbleSortStep;
  sortingHistory: BubbleSortStep[];
  constructor(private store: Store<fromApp.AppState>) {
  }

  bubleSort(arr: number[], predicate: compare) {
    arr = [...arr];
    this.sortingHistory = new Array<BubbleSortStep>();
    for (let i = 0; i < arr.length; i++) {
      for (let k = 0; k < arr.length - 1 - i; k++) {
        this.sortingStep = new BubbleSortStep();
        this.sortingStep.comparedCouple = { x: arr[k], y: arr[k + 1], indexX: k, indexY: k + 1 }
        this.sortingStep.isCompleted = false;
        this.sortingStep.startingArr = [...arr];
        if (predicate(arr[k], arr[k + 1])) {
          swapElements(k, k + 1, arr)
          this.sortingStep.didSwap = true
        } else {
          this.sortingStep.didSwap = false;
        }

        this.sortingStep.resultArr = [...arr]

        if (k === arr.length - 2 - i) {
          this.sortingStep.isCompleted = true;
        }

        this.sortingHistory.push(this.sortingStep);
      }
    }
    this.store.dispatch(new fromBubbleSortActions.AddBubbleSortHistory(this.sortingHistory))
  }
}

interface compare {
  (x: number, y: number): boolean;
}


