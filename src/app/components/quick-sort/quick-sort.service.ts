import { Injectable } from '@angular/core';
import { swapElements } from '../../shared/utils/swap-elements';
import * as fromApp from '../../store/app.reducer';
import * as fromQuickSortActions from './store/quick-sort.actions';
import { Store } from '@ngrx/store';
import { QuickSortStep } from 'src/app/models/quick-sort/QuickSortStep';
import { ComparedCouple } from 'src/app/models/shared/ComparedCouple';

@Injectable({
  providedIn: 'root'
})
export class QuickSortService {
  private sortingStep: QuickSortStep;
  private sortingHistory: QuickSortStep[];

  constructor(private store: Store<fromApp.AppState>) { }

  sort(arr: number[]) {
    arr = [...arr];
    this.sortingHistory = [];
    this.myQuickSort(arr, 0, arr.length - 1);
    this.store.dispatch(new fromQuickSortActions.AddQuickSortHistory(this.sortingHistory));
  }

  // private quickSort(arr: number[], left: number, right: number) {
  //   let index;

  //   if (arr.length > 1) {
  //     index = this.partition(arr, left, right)

  //     if (left < index - 1) {
  //       this.quickSort(arr, left, index - 1)
  //     }

  //     if (index < right) {
  //       this.quickSort(arr, index, right)
  //     }
  //   }
  //   return arr;
  // }

  // private partition(arr: number[], left: number, right: number) {

  //   let pivotIndex = Math.floor((left + right) / 2),
  //     pivot = arr[pivotIndex],
  //     i = left,
  //     j = right,
  //     tempComparedCouple: ComparedCouple;

  //   while (i <= j) {
  //     pivotIndex = arr.indexOf(pivot);
  //     // reverse the operators below to change from ascending to descending order
  //     do {
  //       tempComparedCouple = { x: arr[i], y: pivot, indexX: i, indexY: pivotIndex };
  //       this.sortingStep = new QuickSortStep(pivotIndex, pivot, undefined, undefined, tempComparedCouple, false, [...arr], [...arr], false);

  //       if (arr[i] < pivot) {
  //         i++;
  //       } else {
  //         this.sortingStep.leftValueIndex = i;
  //       }

  //       this.sortingHistory.push(this.sortingStep);
  //     }
  //     while (arr[i] < pivot)

  //     do {
  //       tempComparedCouple = { x: arr[j], y: pivot, indexX: j, indexY: pivotIndex };
  //       this.sortingStep = new QuickSortStep(pivotIndex, pivot, i, undefined, tempComparedCouple, false, [...arr], [...arr], false);

  //       if (arr[j] > pivot) {
  //         j--;
  //       } else {
  //         this.sortingStep.rightValueIndex = j;
  //       }

  //       this.sortingHistory.push(this.sortingStep);
  //     }
  //     while (arr[j] > pivot)

  //     if (i <= j) {
  //       if (i !== j) {
  //         tempComparedCouple = { x: arr[i], y: arr[j], indexX: i, indexY: j };
  //         this.sortingStep = new QuickSortStep(pivotIndex, pivot, i, j, tempComparedCouple, true, [...arr], undefined, false);
  //         swapElements(i, j, arr)
  //         this.sortingStep.resultArr = [...arr]

  //         this.sortingHistory.push(this.sortingStep);
  //       }

  //       if (i === j) {
  //         tempComparedCouple = { x: arr[i], y: arr[j], indexX: i, indexY: j };
  //         this.sortingStep = new QuickSortStep(pivotIndex, pivot, i, j, tempComparedCouple, true, [...arr], undefined, false);
  //         this.sortingStep.resultArr = [...arr]
  //         this.sortingStep.isCompleted = true;
  //         this.sortingHistory.push(this.sortingStep);
  //         // this.sortingHistory[this.sortingHistory.length - 1].isCompleted = true;
  //       }
  //       i++;
  //       j--;
  //     }
  //   }
  //   return i;
  // }

  myQuickSort(arr: number[], left, right) {

    if (left < right) {
      let p = this.myPartition(arr, left, right)

      this.myQuickSort(arr, left, p - 1);
      this.myQuickSort(arr, p + 1, right)
    }
  }

  myPartition(arr: number[], left: number, right: number): number {
    let piv = arr[right],
      i = left,
      tempComparedCouple: ComparedCouple;

    for (let j = left; j < right; j++) {
      
      tempComparedCouple = { x: arr[j], indexX: j, y: piv, indexY: right };
      this.sortingStep = new QuickSortStep(right,j,i,tempComparedCouple,false,[...arr],[...arr],false);

      if (arr[j] < piv) {
        if(j !== i){
          this.sortingStep.didSwap = true;
          swapElements(j, i, arr);
          this.sortingStep.resultArr = [...arr];
        }
        i++;
      }
      this.sortingHistory.push(this.sortingStep);
    }
    this.sortingStep = new QuickSortStep(right,-1,i,null,true,[...arr],[...arr],true);
    
    if(right !== i){
      swapElements(right, i, arr);
      this.sortingStep.resultArr = [...arr];
    }
    this.sortingHistory.push(this.sortingStep);


    return i;
  }
}
