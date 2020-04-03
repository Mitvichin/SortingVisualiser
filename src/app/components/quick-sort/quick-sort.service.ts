import { Injectable } from '@angular/core';
import { swapElements } from '../../utils/swapElements';

@Injectable({
  providedIn: 'root'
})
export class QuickSortService {

  constructor() { }

  sort(arr: number[], left: number, right: number) {
    let index;

    if (arr.length > 1) {
      index = this.partition(arr, left, right)

      if (left < index - 1) {
        this.sort(arr, left, index - 1)
      }

      if (index < right) {
        this.sort(arr, index, right)
      }
    }

    return arr;
  }

  partition(arr: number[], left: number, right: number) {
    let pivot = arr[Math.floor((left + right) / 2)],
      i = left,
      j = right;

    while (i <= j) {
      // change reverse the operators below to change from ascending to descending order
      while (arr[i] < pivot) {
        i++;
      }

      while (arr[j] > pivot) {
        j--;
      }

      if (i <= j) {
        swapElements(i, j, arr)
        i++;
        j--;
      }
    }
    return i;
  }
}
