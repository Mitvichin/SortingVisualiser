import { Component, OnInit, Renderer2, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { QuickSortService } from './quick-sort.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as fromQuickSortActions from './store/quick-sort.actions';
import * as fromVisualizerActions from '../visualizer/store/visualizer.actions';
import { QuickSortStep } from 'src/app/models/quick-sort/QuickSortStep';
import { delay } from '../../shared/utils/delay';
import { BaseSortComponent } from 'src/app/shared/components/base/base-sort.component';
import { BaseSortEffects } from 'src/app/shared/base-effects/base-sort.effects';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'quick-sort',
  templateUrl: './quick-sort.component.html',
  styleUrls: ['./quick-sort.component.scss']
})
export class QuickSortComponent extends BaseSortComponent implements OnInit, AfterViewInit, OnDestroy {

  private itemsToBeSwapedColorClass: string;
  private endOfSmallerNumbersIndexClass: string = 'endOfSmallerNumbersIndex'
  private pivotClass = 'pivot';

  constructor(
    protected store: Store<fromApp.AppState>,
    protected sortService: QuickSortService,
    protected renderer: Renderer2,
    protected detector: ChangeDetectorRef,
    protected baseEffects: BaseSortEffects) {
    super(
      store,
      renderer,
      detector,
      sortService,
      baseEffects,
      new fromQuickSortActions.DeleteQuickSortHistory(),
      fromApp.StateSelector.selectQuickSort,
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.store.select(fromApp.StateSelector.selectOptions).pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      this.itemsToBeSwapedColorClass = data.itemsToBeSwapedColor;
    })
  }

  async visualise(sortHistory: QuickSortStep[]) {
    this.DOMElWidth = (this.arrDomChildren[0] as HTMLElement).getBoundingClientRect().width + this.DOMElMargin * 2; // *2 because we have 2 sides with 2px margin
    sortHistory = sortHistory.splice(this.currentIndex, sortHistory.length); // splicing the original history incase the pause btn was pressed and we need to continue from where we paused

    if (sortHistory.length > 0) {
      this.store.dispatch(new fromVisualizerActions.ChangeSourceArr(false));
      //used for of because it can be async
      for (const { i, el } of sortHistory.map((el, i) => ({ i, el }))) {
        //determine the right index to swap
        let numberToSwapIndex = el.leftValueIndex !== -1 ? el.leftValueIndex : el.pivotIndex;
        if (el.didSwap)
          this.calculateSwapDistance(numberToSwapIndex, el);
        // increases the speed of the iteration
        await delay(this.iterationSpeed);

        // initialises them temporary step
        this.illustrativeArr = [...el.startingArr];

        // visualizes the pivot index in the array
        await delay(500)
        this.markPivotIndexAndSmallerNumberEndIndex(el);

        // visualizes the two compared numbers
        await this.markComparedNumbers(el, numberToSwapIndex);

        if (el.didSwap) {
          await this.swapNumbers(numberToSwapIndex, el);
        }

        await delay(500);
        this.illustrativeArr = [...el.resultArr];

        this.preserveElementsLocation(el, numberToSwapIndex);

        await delay(500);
        this.removeComparedClass(numberToSwapIndex, el);

        await this.tryRemoveSmallerNumbersEndIndexIndicator(sortHistory, i, el);

        if (el.didSwap) {
          this.addTransition(numberToSwapIndex, el);
        }

        if (el.isCompleted) {
          await this.markAsCompleted(el, numberToSwapIndex);
        }

        this.currentIndex = ++this.currentIndex; // keep track of the visualization progrees in case of play/pause
        this.store.dispatch(new fromVisualizerActions.AddCurrentArr(el.resultArr));

        if (this.shouldPause) {
          this.pauseVisualization();
          return;
        }
      }
      // pausing again so we can indicate that the visualization has completed
      this.pauseVisualization()
    }

    // this will happen only if you dont stop the visualization by force
    this.markRemainingNumbersAsCompleted();
    this.afterSortIsCompleted();
  }

  private calculateSwapDistance(numberToSwapIndex: number, el: QuickSortStep) {
    this.itemSwapDistance = Math.abs(numberToSwapIndex - el.endOfSmallerNumbersIndex) * this.DOMElWidth;
  }

  private addTransition(numberToSwapIndex: number, el: QuickSortStep) {
    this.renderer.setStyle(this.arrDomChildren[numberToSwapIndex], "transition", '.5s ease-in-out');
    this.renderer.setStyle(this.arrDomChildren[el.endOfSmallerNumbersIndex], "transition", '.5s ease-in-out');
  }

  private async tryRemoveSmallerNumbersEndIndexIndicator(sortHistory: QuickSortStep[], i: number, el: QuickSortStep) {
    if (sortHistory[i].endOfSmallerNumbersIndex !== sortHistory[i + 1]?.endOfSmallerNumbersIndex) {
      await delay(250);
      this.renderer.removeClass(this.arrDomChildren[el.endOfSmallerNumbersIndex], this.endOfSmallerNumbersIndexClass);
    }
  }

  private removeComparedClass(numberToSwapIndex: number, el: QuickSortStep) {
    this.renderer.removeClass(this.arrDomChildren[numberToSwapIndex], this.comparedPairColorClass);
    this.renderer.removeClass(this.arrDomChildren[el.endOfSmallerNumbersIndex], this.comparedPairColorClass);
  }

  private preserveElementsLocation(el: QuickSortStep, numberToSwapIndex: number) {
    if (el.didSwap) {
      this.renderer.setStyle(this.arrDomChildren[numberToSwapIndex], "transition", '0s');
      this.renderer.setStyle(this.arrDomChildren[el.endOfSmallerNumbersIndex], "transition", '0s');
      this.renderer.setStyle(this.arrDomChildren[numberToSwapIndex], "transform", 'translate(0)');
      this.renderer.setStyle(this.arrDomChildren[el.endOfSmallerNumbersIndex], "transform", 'translate(0)');
      delay(200);
    }
  }

  private async swapNumbers(numberToSwapIndex: number, el: QuickSortStep) {
    if (numberToSwapIndex !== el.endOfSmallerNumbersIndex) {
      await delay(250);
      this.renderer.addClass(this.arrDomChildren[numberToSwapIndex], this.itemsToBeSwapedColorClass);
      this.renderer.addClass(this.arrDomChildren[el.endOfSmallerNumbersIndex], this.itemsToBeSwapedColorClass);
    }

    await delay(250);
    this.renderer.removeClass(this.arrDomChildren[numberToSwapIndex], this.comparedPairColorClass);
    this.renderer.removeClass(this.arrDomChildren[el.endOfSmallerNumbersIndex], this.comparedPairColorClass);

    this.renderer.setStyle(this.arrDomChildren[numberToSwapIndex], "transform", `translate(-${this.itemSwapDistance}px)`);
    this.renderer.setStyle(this.arrDomChildren[el.endOfSmallerNumbersIndex], "transform", `translate(${this.itemSwapDistance}px)`);
    this.renderer.removeClass(this.arrDomChildren[el.endOfSmallerNumbersIndex], this.endOfSmallerNumbersIndexClass);

    if (numberToSwapIndex !== undefined) {
      await delay(250);
      this.renderer.removeClass(this.arrDomChildren[numberToSwapIndex], this.itemsToBeSwapedColorClass);

      if (el.endOfSmallerNumbersIndex !== undefined)
        this.renderer.removeClass(this.arrDomChildren[el.endOfSmallerNumbersIndex], this.itemsToBeSwapedColorClass);
    }
  }

  private async markComparedNumbers(el: QuickSortStep, numberToSwapIndex: number) {
    if (el.isCompleted === false && numberToSwapIndex !== el.pivotIndex) {
      await delay(500);
      this.renderer.addClass(this.arrDomChildren[numberToSwapIndex], this.comparedPairColorClass);
      this.renderer.addClass(this.arrDomChildren[el.pivotIndex], this.comparedPairColorClass);
    }
  }

  private markPivotIndexAndSmallerNumberEndIndex(el: QuickSortStep) {
    if (this.isCompleted) {
      this.renderer.addClass(this.arrDomChildren[el.endOfSmallerNumbersIndex], this.pivotClass);
      this.renderer.addClass(this.arrDomChildren[el.pivotIndex], this.endOfSmallerNumbersIndexClass);
    }
    else {
      this.renderer.addClass(this.arrDomChildren[el.pivotIndex], this.pivotClass);
      this.renderer.addClass(this.arrDomChildren[el.endOfSmallerNumbersIndex], this.endOfSmallerNumbersIndexClass);
    }
  }

  private async markAsCompleted(el: QuickSortStep, index: number) {
    this.renderer.addClass(this.arrDomChildren[el.endOfSmallerNumbersIndex], this.completedNumberColorClass);
    this.renderer.removeClass(this.arrDomChildren[el.endOfSmallerNumbersIndex], this.pivotClass);

    if (index !== undefined) {
      await delay(500);
      this.renderer.removeClass(this.arrDomChildren[index], this.itemsToBeSwapedColorClass);

      if (el.endOfSmallerNumbersIndex !== undefined)
        this.renderer.removeClass(this.arrDomChildren[el.endOfSmallerNumbersIndex], this.itemsToBeSwapedColorClass);
    }
  }

  private markRemainingNumbersAsCompleted() {
    for (let i = 0; i < this.arrDomChildren.length - 1; i++) {
      this.renderer.addClass(this.arrDomChildren[i], this.completedNumberColorClass);
    }
  }
}
