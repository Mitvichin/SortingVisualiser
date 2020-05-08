import { Component, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { BubbleSortService } from './bubble-sort.service';
import { Store } from '@ngrx/store';
import { BubbleSortStep } from '../../models/bubble-sort/BubbleSortStep';
import * as fromApp from '../../store/app.reducer';
import * as fromBubbleSortActions from '../bubble-sort/store/bubble-sort.actions';
import * as fromVisualizerActions from '../visualizer/store/visualizer.actions';
import { delay } from '../../shared/utils/delay';
import { ascendingSort, descendingSort } from '../../shared/utils/sorting-predicates';
import { calculateElementsHeight } from '../../shared/utils/calculate-elements-height';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
  selector: 'bubble-sort',
  templateUrl: './bubble-sort.component.html',
  styleUrls: ['./bubble-sort.component.scss'],
})
export class BubbleSortComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('arrContainer') arrContainer: ElementRef;

  arrDomChildren: any;
  itemSwapDistance: number = 0;
  DOMElWidth: number = 120;
  iterationSpeed: number = 1000; // in milliseconds
  illustrativeArr: number[];
  initialArr: number[];
  currentArr: number[];
  shouldUseInitialArr: boolean;
  shouldStopVisualizationExecution: boolean = false;

  constructor(
    private sortService: BubbleSortService,
    private store: Store<fromApp.AppState>,
    private renderer: Renderer2, ) {
    super();
  }


  ngOnInit(): void {
    this.store.select('bubbleSort').pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      console.log(this.illustrativeArr)
      this.visualise(data.sortingHistory);
    })

    this.store.select('visualizer').pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      if (!this.illustrativeArr && data.shouldUseInitialArr) {
        this.illustrativeArr = [...data.initialArr];
      } else if (!this.illustrativeArr) {
        this.illustrativeArr = [...data.currentArr];
      }

      this.initialArr = data.initialArr;
      this.currentArr = data.currentArr;
      this.shouldUseInitialArr = data.shouldUseInitialArr
    })
  }

  ngAfterViewInit() {
    this.arrDomChildren = this.arrContainer.nativeElement.children;
    calculateElementsHeight(this.renderer, this.arrDomChildren as HTMLElement[])
  }

  async visualise(bubbleSortHistory: BubbleSortStep[]) {
    if (bubbleSortHistory.length > 0) {
      //used for of because it can be async
      for (const { i, el } of bubbleSortHistory.map((el, i) => ({ i, el }))) {
        if (this.shouldStopVisualizationExecution) return;
        this.itemSwapDistance = Math.abs(el.comparedCouple.indexX - el.comparedCouple.indexY) * this.DOMElWidth;
        // increases the speed of the iteration
        await delay(this.iterationSpeed);
        this.illustrativeArr = [...el.startingArr];

        this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexX], 'comparedCouple');
        this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexY], 'comparedCouple');

        await delay(500);
        if (el.didSwap) {
          this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexY], 'itemToSwap');
          await delay(500)
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transform", `translate(${this.itemSwapDistance}px)`);
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transform", `translate(-${this.itemSwapDistance}px)`);
        } else {
          this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexX], 'itemToSwap');
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
        this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexX], 'comparedCouple');
        this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexY], 'comparedCouple');
        this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexX], 'itemToSwap');
        this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexY], 'itemToSwap');

        if (el.didSwap) {
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transition", '.5s ease-in-out');
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transition", '.5s ease-in-out');
        }

        if (el.isCompleted) {
          this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexY], 'completed');
          if (i === bubbleSortHistory.length - 1) {
            this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexX], 'completed');
          }
        }

        // use the router to deter
        if (this.shouldStopVisualizationExecution) return;
        this.store.dispatch(new fromVisualizerActions.AddCurrentArr(el.resultArr));
      }
    }
  }

  async sort() {
    if (this.shouldUseInitialArr) {
      this.illustrativeArr = [...this.initialArr];
    } else {
      this.illustrativeArr = [...this.currentArr];
    }

    console.log(this.illustrativeArr)
    this.sortService.bubleSort(this.illustrativeArr, ascendingSort);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromBubbleSortActions.DeleteBubbleSortHistory());
    this.shouldStopVisualizationExecution = true;
    super.ngOnDestroy();
  }
}
