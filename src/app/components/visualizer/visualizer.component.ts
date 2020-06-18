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
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent extends BaseComponent implements OnInit {
  readonly playBtnImageName: string=  'play-btn.png';
  readonly pauseBtnImageName:string = 'pause-btn.png';
  isBubbleSort: boolean = true;
  isQuickSort: boolean = false;
  isSelectionSort: boolean = false;
  changeSourceBtnArr: string = ""; // used in the template
  imgName:string;
  arrSizeOptions: typeof ArraySizeOption = ArraySizeOption; // used in the template
  enablePlayBtn: boolean = true;
  private shouldUseInitialArr: boolean;
  private shouldStart: boolean;
  private shouldPause: boolean;

  @ViewChild(BubbleSortComponent) private bubbleSortComponent: BubbleSortComponent;
  @ViewChild(SelectionSortComponent) private selectionSortComponent: SelectionSortComponent;
  @ViewChild(QuickSortComponent) private quickSortComponent: QuickSortComponent;
  @ViewChild('optionsModal') private optionsModal: ModalComponent;
  @ViewChild('infoModal') private infoModal: ModalComponent
  @ViewChild('sizeDropdown') private sizeDropdown: ElementRef;

  constructor(private store: Store<fromApp.AppState>, private renderer: Renderer2,
    private detector: ChangeDetectorRef) {
      super();
      this.imgName = this.playBtnImageName;
  }

  ngOnInit(): void {
    this.generateNewArr(ArraySizeOption.medium)
    this.store.select(fromApp.StateSelector.selectVisualizer).pipe(takeUntil(this.$unsubscribe)).subscribe(storeData => {
      let data: typeof storeData = deepCopy(storeData);

      this.shouldUseInitialArr = data.shouldUseInitialArr;
      this.shouldPause = data.shouldPause;
      this.shouldStart = data.shouldStart;

      if (this.shouldUseInitialArr) {
        this.changeSourceBtnArr = "Initial array";
      } else {
        this.changeSourceBtnArr = "Current array";
      }
    })
  }

  onSortCompleted() {
    this.imgName = this.playBtnImageName;
  }

  addSizeBtnHoverClass() {
    this.renderer.addClass(this.sizeDropdown.nativeElement, "size-btn");
  }

  isAllowed() {
    return this.shouldStart;
  }

  async generateNewArr(option: number) {

    if (this.sizeDropdown) {
      this.renderer.removeClass(this.sizeDropdown.nativeElement, "size-btn");
    }
    this.detector.detectChanges();

    let tempArr: number[] = [];
    for (let i = 0; i < option; i++) {
      tempArr.push(Math.floor(Math.random() * 500))
    }

    this.store.dispatch(new fromVisualizerActions.SaveRandomArr(tempArr));
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
      this.imgName = this.pauseBtnImageName;
      if (this.isBubbleSort) {
        this.bubbleSortComponent.sort();
      }

      if (this.isSelectionSort) {
        this.selectionSortComponent.sort();
      }

      if (this.isQuickSort) {
        this.quickSortComponent.sort();
      }
    } else if (!this.shouldPause) {
      this.store.dispatch(new fromVisualizerActions.ShouldPauseVisualization(true));
      this.imgName = this.playBtnImageName;
    }
  }

  openOptions() {
    this.optionsModal.open();
  }

  openInfo() {
    this.infoModal.open();
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
