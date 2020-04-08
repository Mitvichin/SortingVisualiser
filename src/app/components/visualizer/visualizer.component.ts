import { Component, OnInit, ViewChild } from '@angular/core';
import { BubbleSortComponent } from '../bubble-sort/bubble-sort.component';
import { QuickSortComponent } from '../quick-sort/quick-sort.component';
import { SelectionSortComponent } from '../selection-sort/selection-sort.component';

@Component({
  selector: 'visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit {
  private isBubbleSort: boolean = true;
  private isQuickSort: boolean = false;
  private isSelectionSort: boolean = false;

  @ViewChild(BubbleSortComponent) private bubbleSortComponent: BubbleSortComponent;
  @ViewChild(SelectionSortComponent) private selectionSortComponent: SelectionSortComponent;
  @ViewChild(QuickSortComponent) private quickSortComponent: QuickSortComponent;

  constructor() { }

  ngOnInit(): void {
  }

  activateBubbleSort() {
    this.isBubbleSort = true;
    this.isQuickSort = this.isSelectionSort = false;
  }
  activateSelectionSort() {
    this.isSelectionSort = true;
    this.isQuickSort = this.isBubbleSort = false;
  }
  activateQuickSort() {
    this.isQuickSort = true;
    this.isBubbleSort = this.isSelectionSort = false;
  }

  sort(){
    if(this.isBubbleSort){
      this.bubbleSortComponent.sort();
    }

    if(this.isSelectionSort){
      this.selectionSortComponent.sort();
    }

    if(this.isQuickSort){
      this.quickSortComponent.sort();
    }
  }

}
