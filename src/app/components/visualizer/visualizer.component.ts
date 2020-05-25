import { Component, OnInit, ViewChild, Renderer2, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BubbleSortComponent } from '../bubble-sort/bubble-sort.component';
import { QuickSortComponent } from '../quick-sort/quick-sort.component';
import { SelectionSortComponent } from '../selection-sort/selection-sort.component';
import { Store } from '@ngrx/store';
import * as fromVisualizerActions from './store/visualizer.actions';
import * as fromApp from '../../store/app.reducer';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ArraySizeOption } from 'src/app/shared/enums/ArraySizeOption';
import { delay } from 'src/app/shared/utils/delay';
import { deepCopy } from 'src/app/shared/utils/deep-copy';

@Component({
  selector: 'visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent extends BaseComponent implements OnInit {
  private isBubbleSort: boolean = true;
  private isQuickSort: boolean = false;
  private isSelectionSort: boolean = false;
  private shouldUseInitialArr: boolean;
  private isVisualizing: boolean;
  private changeSourceBtnArr: string = ""; // used in the template
  private btnImgSource: string ="../../../assets/play-btn.png" // used in the template
  private arrSizeOptions: typeof ArraySizeOption = ArraySizeOption; // used in the template
  private enablePlayBtn: boolean = true;
  private shouldStart: boolean;
  private shouldPause: boolean;

  @ViewChild(BubbleSortComponent) private bubbleSortComponent: BubbleSortComponent;
  @ViewChild(SelectionSortComponent) private selectionSortComponent: SelectionSortComponent;
  @ViewChild(QuickSortComponent) private quickSortComponent: QuickSortComponent;
  @ViewChild('sizeDropdown') private sizeDropdown: ElementRef;

  constructor(private store: Store<fromApp.AppState>, private renderer: Renderer2,
    private detector: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.store.select(fromApp.StateSelector.selectVisualizer).pipe(takeUntil(this.$unsubscribe)).subscribe(storeData => {
      let data: typeof storeData = deepCopy(storeData);

      this.shouldUseInitialArr = data.shouldUseInitialArr;
      this.isVisualizing = data.isVisualizing;
      this.shouldPause = data.shouldPause;
      this.shouldStart = data.shouldStart;

      if (this.shouldUseInitialArr) {
        this.changeSourceBtnArr = "Initial array";
      } else {
        this.changeSourceBtnArr = "Current array";
      }
    })
  }

  onSortCompleted(){
    this.btnImgSource = "../../../assets/play-btn.png";
  }

  addSizeBtnHoverClass() {
    this.renderer.addClass(this.sizeDropdown.nativeElement, "size-btn");
  }

  isAllowed() {
    return this.shouldStart;
  }

  async generateNewArr(option: number) {

    this.renderer.removeClass(this.sizeDropdown.nativeElement, "size-btn");
    this.detector.detectChanges();

    let tempArr: number[] = [];
    for (let i = 0; i < option; i++) {
      tempArr.push(Math.floor(Math.random() * 500))
    }

    this.store.dispatch(new fromVisualizerActions.GenerateRandomArr(tempArr));
  }

  async changeSourceArr() {
    if (this.isBubbleSort) {
      await this.bubbleSortComponent.reset();
    } else if (this.isQuickSort) {
      await this.quickSortComponent.reset();
    } else {
      await this.selectionSortComponent.reset();
    }

    this.store.dispatch(new fromVisualizerActions.ChangeSourceArr(!this.shouldUseInitialArr))
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

  async sort() {

    if (this.shouldStart) {
      this.store.dispatch(new fromVisualizerActions.ShouldStartVisualization(false));
      this.btnImgSource = "../../../assets/pause-btn.png";
      if (this.isBubbleSort) {
        this.bubbleSortComponent.sort();
      }

      if (this.isSelectionSort) {
        this.selectionSortComponent.sort();
      }

      if (this.isQuickSort) {
        this.quickSortComponent.sort();
      }
    }else if(!this.shouldPause){
      this.store.dispatch(new fromVisualizerActions.ShouldPauseVisualization(true));
      this.btnImgSource = "../../../assets/play-btn.png";
    }
  }

  clickIfAllowed(callback: Function) {
    if (this.isAllowed()) {
      callback.bind(this)();
    }
  }

  clickIfEnable(callback: Function) {
    if (this.enablePlayBtn) {
      callback.bind(this)();
    }
  }
}
