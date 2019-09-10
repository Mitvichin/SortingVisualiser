import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { SortingService } from './sorting.service';
import { VisualisationModel } from '../models/VisualisationModel';

@Component({
  selector: 'app-sorting-visualser',
  templateUrl: './sorting-visualiser.component.html',
  styleUrls: ['./sorting-visualiser.component.scss'],

})
export class SortingVisualiserComponent implements OnInit {
  arr: number[] = [45,10, 80, 30, 29, 90, 40, 50, 70]
  itemsToBeChanged: VisualisationModel;
  constructor(private sortingService: SortingService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.sortingService.itemsToBeChanged.subscribe((items) => {
      this.itemsToBeChanged = items;
      //console.log(this.changedElementIndex);
    })
    this.ref.detach();
    this.ref.detectChanges()
    console.log(this.arr);
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
