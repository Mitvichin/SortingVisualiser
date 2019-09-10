import { Injectable, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { VisualisationModel } from '../models/VisualisationModel';

@Injectable({
  providedIn: 'root'
})
export class SortingService {
  itemsToBeChanged = new Subject<VisualisationModel>();
  visModel = new VisualisationModel();
  constructor() { }

  async bubleSort(arr: number[], predicate: compare, ref: ChangeDetectorRef) {

    for (let i = 0; i < arr.length; i++) {
      for (let k = 0; k < arr.length - 1; k++) {
        if (predicate(arr[k], arr[k + 1])) {
          await this.swapElements(k, k + 1, arr, 500, ref)
        }
      }
      console.log(arr.length-1-i);
      await this.updateItems(ref, null, null,arr.length-1-i )
      await this.delay(200)
    }

  }

  async selectionSort(arr: number[], ref: ChangeDetectorRef) {
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
        await this.delay(200);
        this.updateItems(ref, j, i);
      }
      await this.swapElements(minIndex, i, arr, 500, ref)
    }
  }

  async quickSort(arr: number[], ref: ChangeDetectorRef) {
    this.innerQuickSort(arr, 0, arr.length - 1, ref);
  }

  private async innerQuickSort(arr: number[], low: number, high: number, ref: ChangeDetectorRef) {
    if (low < high) {
      console.log("vlezna we")
      let pi = await this.quickSortPartition(arr, low, high, ref);
      this.innerQuickSort(arr, low, pi - 1, ref);
      this.innerQuickSort(arr, pi + 1, high, ref);
    }
  }

  private async  quickSortPartition(arr: number[], low: number, high: number, ref: ChangeDetectorRef) {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        await this.swapElements(i, j, arr, 500, ref)
        // let temp = arr[i];
        // arr[i] = arr[j];
        // arr[j] = temp;
        // console.log(arr)
      }
    }
    console.log(arr[i + 1] + " and " + arr[high])
    await this.swapElements(i + 1, high, arr, 500, ref)
    // let temp1 = arr[i+1];
    // arr[i+1] = arr[high];
    // arr[high] = temp1;
    console.log(arr)

    return i + 1;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async swapElements(x, y, arr: any[], speed: number, ref: ChangeDetectorRef) {
    this.updateItems(ref, x, y)
    await this.delay(speed);
    let temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;
    await this.delay(speed);
    ref.detectChanges();
  }

  private async updateItems(ref: ChangeDetectorRef, x?: number, x1?: number, completedIndex?: number, pivot?: number) {
    
    if (x>=0 && x1 >=0) {
      this.visModel.swappingCouple.x = x;
      this.visModel.swappingCouple.x1 = x1;
    }

    if (pivot)
      this.visModel.pivot = pivot;

    if (completedIndex>=0){
      this.visModel.completedIndexes.push(completedIndex)
      console.log(completedIndex + "in sortgin service completedIndex")
    }

    this.itemsToBeChanged.next(this.visModel);
    await this.delay(500);
    ref.detectChanges();
  }
}
interface compare {
  (x: number, y: number): boolean;
}


