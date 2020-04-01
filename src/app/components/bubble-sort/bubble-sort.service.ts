import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { BubbleSortStep } from '../../models/bubble-sort/BubbleSortStep';
import * as fromVisualiserActions from './store/bubble-sort.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class BubbleSortService {
  itemsToBeChanged = new Subject<any>();
  visModel: any;
  sortingStep: BubbleSortStep;
  bubbleSortHistory: BubbleSortStep[];
  constructor(private store: Store<fromApp.AppState>) {
  }

  bubleSort(arr: number[], predicate: compare) {
    this.bubbleSortHistory = new Array<BubbleSortStep>();
    for (let i = 0; i < arr.length; i++) {
      for (let k = 0; k < arr.length - 1 - i; k++) {
        this.sortingStep = new BubbleSortStep();
        this.sortingStep.comparedCouple = { x: arr[k], y: arr[k + 1], indexX: k, indexY: k + 1 }
        this.sortingStep.isCompleted = false;
        this.sortingStep.startingArr = [...arr];
        if (predicate(arr[k], arr[k + 1])) {
          this.swapElements(k, k + 1, arr)
          this.sortingStep.didSwap = true
        } else {
          this.sortingStep.didSwap = false;
        }

        this.sortingStep.resultArr = [...arr]

        if (k === arr.length - 2 - i) {
          this.sortingStep.isCompleted = true;
        }

        this.bubbleSortHistory.push(this.sortingStep);
      }
    }
    this.store.dispatch(new fromVisualiserActions.AddBubbleSortHistory(this.bubbleSortHistory))
  }

  selectionSort(arr: number[]) {
    this.bubbleSortHistory = new Array<BubbleSortStep>();
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        // this.sortingStep = new BubbleSortStep();
        // this.sortingStep.comparedCouple = { x: arr[minIndex], y: arr[j], indexX: minIndex, indexY: j }
        // this.sortingStep.startingArr = [...arr];
        // this.sortingStep.resultArr = [...arr];
        // this.sortingStep.didSwap = false;
        // this.bubbleSortHistory.push(this.sortingStep);
        if (arr[minIndex] > arr[j]) {
          minIndex = j;
        }
      }
      // this.sortingStep = new BubbleSortStep();
      // this.sortingStep.comparedCouple = { x: arr[i], y: arr[minIndex], indexX: i, indexY: minIndex}
      // this.sortingStep.startingArr = [...arr];
      // this.sortingStep.didSwap = true;
      this.swapElements(i, minIndex, arr)
      // this.sortingStep.resultArr = [...arr];
      // this.bubbleSortHistory.push(this.sortingStep);
    }

    this.store.dispatch(new fromVisualiserActions.AddBubbleSortHistory(this.bubbleSortHistory));
  }

  // async quickSort(arr: number[], ref: ChangeDetectorRef) {
  //   this.innerQuickSort(arr, 0, arr.length - 1, ref);
  // }

  // private async innerQuickSort(arr: number[], low: number, high: number, ref: ChangeDetectorRef) {
  //   if (low < high) {
  //     console.log("vlezna we")
  //     let pi = await this.quickSortPartition(arr, low, high, ref);
  //     this.innerQuickSort(arr, low, pi - 1, ref);
  //     this.innerQuickSort(arr, pi + 1, high, ref);
  //   }
  // }

  // private async  quickSortPartition(arr: number[], low: number, high: number, ref: ChangeDetectorRef) {
  //   let pivot = arr[high];
  //   let i = low - 1;

  //   for (let j = low; j < high; j++) {
  //     if (arr[j] < pivot) {
  //       i++;
  //       await this.swapElements(i, j, arr, 500, ref)
  //       // let temp = arr[i];
  //       // arr[i] = arr[j];
  //       // arr[j] = temp;
  //     }
  //   }
  //   console.log(arr[i + 1] + " and " + arr[high])
  //   await this.swapElements(i + 1, high, arr, 500, ref)
  //   // let temp1 = arr[i+1];
  //   // arr[i+1] = arr[high];
  //   // arr[high] = temp1;
  //   return i + 1;
  // }

  // delay(ms: number) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  swapElements(x, y, arr: any[]) {
    let temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;
  }

  // private async updateItems(ref: ChangeDetectorRef, x?: number, x1?: number, completedIndex?: number, pivot?: number) {

  //   if (x>=0 && x1 >=0) {
  //     this.visModel.swappingCouple.x = x;
  //     this.visModel.swappingCouple.x1 = x1;
  //   }

  //   if (pivot)
  //     this.visModel.pivot = pivot;

  //   if (completedIndex>=0){
  //     this.visModel.completedIndexes.push(completedIndex)
  //     //console.log(completedIndex + "in sortgin service completedIndex")
  //   }

  //   this.itemsToBeChanged.next(this.visModel);
  //   await this.delay(500);
  //   ref.detectChanges();
  // }
}
interface compare {
  (x: number, y: number): boolean;
}


