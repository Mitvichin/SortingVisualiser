import { Component, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SelectionSortService } from './selection-sort.service';
import { SelectionSortStep } from 'src/app/models/selection-sort/SelectionSortStep';
import { Store } from '@ngrx/store';
import { delay } from 'src/app/shared/utils/delay';
import * as fromApp from './../../store/app.reducer';
import * as fromSelectionSortActions from './store/selection-sort.actions';
import * as fromVisualizerActions from '../visualizer/store/visualizer.actions';
import { calculateElementsHeight } from '../../shared/utils/calculate-elements-height';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { takeUntil } from 'rxjs/operators';
import { areArrsEqual } from 'src/app/shared/utils/are-arrs-equal';

@Component({
  selector: 'selection-sort',
  templateUrl: './selection-sort.component.html',
  styleUrls: ['./selection-sort.component.scss']
})
export class SelectionSortComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('arrContainer') arrContainer: ElementRef;
  arrDomChildren: any = [];
  itemSwapDistance: number = 0;
  DOMElWidth: number = 0;
  DOMElMargin: number = 2; //px
  iterationSpeed: number = 1000; // in milliseconds
  illustrativeArr: number[];
  initialArr: number[];
  currentArr: number[];
  shouldUseInitialArr: boolean;
  isVisualizing: boolean;
  shouldStopVisualizationExecution: boolean = false;

  constructor(
    private store: Store<fromApp.AppState>,
    private sortService: SelectionSortService,
    private renderer: Renderer2,
    private detector: ChangeDetectorRef) {
    super()
  }

  ngOnInit(): void {
    this.store.select('selectionSort').pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      if (data.sortingHistory.length > 0)
        this.visualise(data.sortingHistory);
    })

    this.store.select('visualizer').pipe(takeUntil(this.$unsubscribe)).subscribe(async data => {
      if (!data.isVisualizing)
        if (data.shouldUseInitialArr) {
          this.illustrativeArr = [...data.initialArr];
        } else {
          this.illustrativeArr = [...data.currentArr];
        }

      this.initialArr = data.initialArr;
      this.currentArr = data.currentArr;
      this.shouldUseInitialArr = data.shouldUseInitialArr
      this.isVisualizing = data.isVisualizing;

      if (areArrsEqual(this.initialArr, this.currentArr) && !data.isVisualizing) {
        this.detector.detectChanges();
        calculateElementsHeight(this.renderer, this.arrDomChildren as HTMLElement[], this.DOMElMargin)
      }
    })
  }

  ngAfterViewInit(): void {
    console.log(this.arrContainer)
    this.arrDomChildren = this.arrContainer.nativeElement.children;
    calculateElementsHeight(this.renderer, this.arrDomChildren as HTMLElement[], this.DOMElMargin);
  }

  async visualise(sortHistory: SelectionSortStep[]) {
    this.DOMElWidth = (this.arrDomChildren[0] as HTMLElement).getBoundingClientRect().width + this.DOMElMargin * 2;
    if (sortHistory.length > 0) {
      this.store.dispatch(new fromVisualizerActions.ChangeSourceArr(false));
      let smallestIndex = -1;
      //used for of because it can be async
      for (const { i, el } of sortHistory.map((el, i) => ({ i, el }))) {
        if (this.shouldStopVisualizationExecution) return;

        this.itemSwapDistance = Math.abs(el.comparedCouple.indexX - el.comparedCouple.indexY) * this.DOMElWidth;
        // increases the speed of the iteration
        await delay(this.iterationSpeed);

        // initialises them temporary step
        this.illustrativeArr = [...el.startingArr];

        this.renderer.addClass(this.arrDomChildren[el.swapIndex], 'swapIndex');
        await delay(500)
        // visualizes the two compared numbers
        if (!el.didSwap) {
          this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexX], 'comparedCouple');
          this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexY], 'comparedCouple');
        }

        if (smallestIndex !== el.minValueIndex && smallestIndex !== -1) {
          await delay(200)
          this.renderer.removeClass(this.arrDomChildren[smallestIndex], 'smallestNumber');
        }
        // visualizes the swaping index in the array
        await delay(600)
        smallestIndex = el.minValueIndex;
        this.renderer.addClass(this.arrDomChildren[smallestIndex], 'smallestNumber')

        if (el.didSwap) {
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transform", `translate(${this.itemSwapDistance}px)`);
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transform", `translate(-${this.itemSwapDistance}px)`);
          await delay(300)
          this.renderer.removeClass(this.arrDomChildren[el.swapIndex], 'swapIndex');
        }



        await delay(500);
        this.illustrativeArr = [...el.resultArr];

        if (el.didSwap) {
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transition", '0s');
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transition", '0s');
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transform", 'translate(0)');
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transform", 'translate(0)');
          delay(200);
        }

        await delay(200);
        if (!el.didSwap) {
          this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexX], 'comparedCouple');
          this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexY], 'comparedCouple');
        }

        if (el.didSwap) {
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transition", '.5s ease-in-out');
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transition", '.5s ease-in-out');
        }

        if (el.isCompleted) {
          this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexX], 'completed');
          this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexX], 'smallestNumber');
          if (i === sortHistory.length - 1) {
            this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexX], 'completed');
            this.renderer.addClass(this.arrDomChildren[el.resultArr.length - 1], 'completed');
          }
        }

        if (this.shouldStopVisualizationExecution) return;
        this.store.dispatch(new fromVisualizerActions.AddCurrentArr(el.resultArr));
      }

      this.store.dispatch(new fromVisualizerActions.ToggleVisualizing());
    }
  }

  async sort() {

    if (this.shouldUseInitialArr) {
      this.illustrativeArr = [...this.initialArr];
    } else {
      this.illustrativeArr = [...this.currentArr];
    }

    this.sortService.selectionSort(this.illustrativeArr);
  }
  ngOnDestroy() {
    this.store.dispatch(new fromSelectionSortActions.DeleteSelectionSortHistory());
    this.shouldStopVisualizationExecution = true;
    if (this.isVisualizing) {
      this.store.dispatch(new fromVisualizerActions.ToggleVisualizing())
    }
    super.ngOnDestroy();
  }
}
