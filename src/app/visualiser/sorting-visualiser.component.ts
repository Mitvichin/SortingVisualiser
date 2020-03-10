import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { SortingService } from './sorting.service';
import { VisualisationModel } from '../models/VisualisationModel';
import { Store } from '@ngrx/store';
import {visualiserReducer } from "./store/visualiser.reducer";

@Component({
  selector: 'app-sorting-visualser',
  templateUrl: './sorting-visualiser.component.html',
  styleUrls: ['./sorting-visualiser.component.scss'],

})
export class SortingVisualiserComponent implements OnInit {
  arr: number[];
  itemsToBeChanged: VisualisationModel;
  constructor(private sortingService: SortingService, private ref: ChangeDetectorRef ,
    private store: Store<{visualiser: {array: number[]}}>) {

   }
   
  ngOnInit() {
    this.ref.detach();
    this.ref.detectChanges()
    console.log(this.arr);

    this.store.select('visualiser').subscribe(data =>{
      this.arr = data.array;
    })
  }

  async sort() {
    await this.sortingService.bubleSort(this.arr,this.ascendingSort, this.ref);
    //console.log(this.arr);
    this.ref.detectChanges();
  }
  rnd() {
    return "rnd";
  }

  isCurrent(i: number) {
    if (this.itemsToBeChanged) {
      if (i == this.itemsToBeChanged.swappingCouple.x) {
        return "curr"
      }
    }

    return "";
  }

  isNext(i: number) {
    if (this.itemsToBeChanged) {
      if (i == this.itemsToBeChanged.swappingCouple.x1) {
        return "next"
      }
    }

    return "";
  }

  isCompleted(i){
    if (this.itemsToBeChanged) {
      if(i == 0){
        console.log(this.itemsToBeChanged.completedIndexes)
        console.log(this.itemsToBeChanged.checkIfCompleted(i))
      }
      if (this.itemsToBeChanged.checkIfCompleted(i)) {
        return "completed"
      }
    }

    return "";
  }

  private ascendingSort(x, y) {
    return x > y;
  }

  private descendingSort(x, y) {
    return x < y;
  }
}
