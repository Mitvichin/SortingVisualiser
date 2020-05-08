import { Component, OnInit, ViewChild, Renderer2, ElementRef, ChangeDetectorRef } from '@angular/core';
import { BubbleSortComponent } from '../bubble-sort/bubble-sort.component';
import { QuickSortComponent } from '../quick-sort/quick-sort.component';
import { SelectionSortComponent } from '../selection-sort/selection-sort.component';
import { Store } from '@ngrx/store';
import * as fromVisualizerActions from './store/visualizer.actions';
import * as fromApp from '../../store/app.reducer';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { delay } from '../../shared/utils/delay';

@Component({
  selector: 'visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent extends BaseComponent implements OnInit {
  private isBubbleSort: boolean = true;
  private isQuickSort: boolean = false;
  private isSelectionSort: boolean = false;
  private changeSourceBtnArr: string = ""; // used in the template
  private arrSizeOptions: Object = {
    small: 6,
    medium: 12,
    big: 24
  }

  @ViewChild(BubbleSortComponent) private bubbleSortComponent: BubbleSortComponent;
  @ViewChild(SelectionSortComponent) private selectionSortComponent: SelectionSortComponent;
  @ViewChild(QuickSortComponent) private quickSortComponent: QuickSortComponent;
  @ViewChild('sizeDropdown') private sizeDropdown: ElementRef;

  constructor(private store: Store<fromApp.AppState>, private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    console.log(this.arrSizeOptions)
    this.store.select('visualizer').pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      console.log(data.shouldUseInitialArr)
      if (data.shouldUseInitialArr) {
        this.changeSourceBtnArr = "Initial array";
      } else {
        this.changeSourceBtnArr = "Current array";
      }
    })
  }

  addSizeBtnHoverClass(){
    this.renderer.addClass(this.sizeDropdown.nativeElement,"size-btn");
  }

  async generateNewArr(option: number) {

    this.renderer.removeClass(this.sizeDropdown.nativeElement,"size-btn");
    this.changeDetector.detectChanges();

    let tempArr: number[] = [];
    for (let i = 0; i < option; i++) {
      tempArr.push(Math.floor(Math.random() * 500))
    }

     this.store.dispatch(new fromVisualizerActions.AddInitialArr(tempArr));
  }

  changeSourceArr() {
    this.store.dispatch(new fromVisualizerActions.ChangeSourceArr())
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

  sort() {
    if (this.isBubbleSort) {
      this.bubbleSortComponent.sort();
    }

    if (this.isSelectionSort) {
      this.selectionSortComponent.sort();
    }

    if (this.isQuickSort) {
      this.quickSortComponent.sort();
    }
  }

}
