import { Component, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SelectionSortService } from './selection-sort.service';
import { SelectionSortStep } from 'src/app/models/selection-sort/SelectionSortStep';
import { Store } from '@ngrx/store';
import { delay } from 'src/app/shared/utils/delay';
import * as fromApp from './../../store/app.reducer';
import * as fromSelectionSortActions from './store/selection-sort.actions';
import * as fromVisualizerActions from '../visualizer/store/visualizer.actions';
import { BaseSortComponent } from 'src/app/shared/components/base/base-sort.component';
import { BaseSortEffects } from 'src/app/shared/base-effects/base-sort.effects';

@Component({
  selector: 'selection-sort',
  templateUrl: './selection-sort.component.html',
  styleUrls: ['./selection-sort.component.scss']
})
export class SelectionSortComponent extends BaseSortComponent implements OnInit, OnDestroy {
  private swapIndexClass = 'swapIndex';
  private smallestNumberClass='smallestNumber';

  constructor(
    protected store: Store<fromApp.AppState>,
    protected sortService: SelectionSortService,
    protected renderer: Renderer2,
    protected detector: ChangeDetectorRef,
    protected baseEffects: BaseSortEffects) {
    super(
      store,
      renderer,
      detector,
      sortService,
      baseEffects,
      new fromSelectionSortActions.DeleteSelectionSortHistory(),
      fromApp.StateSelector.selectSelectionSort)
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  async visualise(sortHistory: SelectionSortStep[]) {
    this.DOMElWidth = (this.arrDomChildren[0] as HTMLElement).getBoundingClientRect().width + this.DOMElMargin * 2; // *2 because we have 2 sides with 2px margin
    sortHistory = sortHistory.splice(this.currentIndex, sortHistory.length); // splicing the original history incase the pause btn was pressed and we need to continue from where we paused

    if (sortHistory.length > 0) {
      this.store.dispatch(new fromVisualizerActions.ChangeSourceArr(false));
      let smallestIndex = -1;
      //used for of because it can be async
      for (const { i, el: step } of sortHistory.map((el, i) => ({ i, el }))) {

        this.itemSwapDistance = Math.abs(step.comparedCouple.indexX - step.comparedCouple.indexY) * this.DOMElWidth;
        // increases the speed of the iteration
        await delay(this.iterationSpeed);

        // initialises the temporary step
        this.illustrativeArr = [...step.startingArr];

        this.renderer.addClass(this.arrDomChildren[step.swapIndex], this.swapIndexClass);
        await delay(500)
        // visualizes the two compared numbers
        if (!step.didSwap) {
          this.addCompairedPairColorClass(step);
        }

        if (smallestIndex !== step.minValueIndex && smallestIndex !== -1) {
          await this.removeSmallestIndexColorClass(smallestIndex);
        }
        // visualizes the swaping index in the array
        await delay(600)
        smallestIndex = step.minValueIndex;
        this.renderer.addClass(this.arrDomChildren[smallestIndex], this.smallestNumberClass)

        if (step.didSwap) {
          await this.swapElements(step);
        }

        await delay(500);
        this.illustrativeArr = [...step.resultArr];

        if (step.didSwap) {
          this.preserveElementsLocation(step);
        }

        await delay(200);
        if (!step.didSwap) {
          this.removeCompairedPairClass(step);
        }

        if (step.didSwap) {
          this.addTransitionToElements(step);
        }

        if (step.isCompleted) {
          this.markAsComplete(step, i, sortHistory);
        }

        this.currentIndex = ++this.currentIndex;
        this.store.dispatch(new fromVisualizerActions.AddCurrentArr(step.resultArr));

        if (this.shouldPause) {
          this.pauseVisualization();
          return;
        }
      }

      this.pauseVisualization()
    }
    // this will happen only if you dont stop the visualization by force
    this.afterSortIsCompleted();
  }

  private async removeSmallestIndexColorClass(smallestIndex: number) {
    await delay(200);
    this.renderer.removeClass(this.arrDomChildren[smallestIndex], this.smallestNumberClass);
  }

  private addCompairedPairColorClass(step: SelectionSortStep) {
    this.renderer.addClass(this.arrDomChildren[step.comparedCouple.indexX], this.comparedPairColorClass);
    this.renderer.addClass(this.arrDomChildren[step.comparedCouple.indexY], this.comparedPairColorClass);
  }

  private async swapElements(step: SelectionSortStep) {
    this.renderer.setStyle(this.arrDomChildren[step.comparedCouple.indexX], "transform", `translate(${this.itemSwapDistance}px)`);
    this.renderer.setStyle(this.arrDomChildren[step.comparedCouple.indexY], "transform", `translate(-${this.itemSwapDistance}px)`);
    await delay(300);
    this.renderer.removeClass(this.arrDomChildren[step.swapIndex], this.swapIndexClass);
  }

  private preserveElementsLocation(step: SelectionSortStep) {
    this.renderer.setStyle(this.arrDomChildren[step.comparedCouple.indexX], "transition", '0s');
    this.renderer.setStyle(this.arrDomChildren[step.comparedCouple.indexY], "transition", '0s');
    this.renderer.setStyle(this.arrDomChildren[step.comparedCouple.indexX], "transform", 'translate(0)');
    this.renderer.setStyle(this.arrDomChildren[step.comparedCouple.indexY], "transform", 'translate(0)');
    delay(200);
  }

  private removeCompairedPairClass(step: SelectionSortStep) {
    this.renderer.removeClass(this.arrDomChildren[step.comparedCouple.indexX], this.comparedPairColorClass);
    this.renderer.removeClass(this.arrDomChildren[step.comparedCouple.indexY], this.comparedPairColorClass);
  }

  private addTransitionToElements(step: SelectionSortStep) {
    this.renderer.setStyle(this.arrDomChildren[step.comparedCouple.indexX], "transition", '.5s ease-in-out');
    this.renderer.setStyle(this.arrDomChildren[step.comparedCouple.indexY], "transition", '.5s ease-in-out');
  }

  private markAsComplete(step: SelectionSortStep, i: number, sortHistory: SelectionSortStep[]) {
    this.renderer.addClass(this.arrDomChildren[step.comparedCouple.indexX], this.completedNumberColorClass);
    this.renderer.removeClass(this.arrDomChildren[step.comparedCouple.indexX], this.smallestNumberClass);
    if (i === sortHistory.length - 1) {
      this.renderer.addClass(this.arrDomChildren[step.comparedCouple.indexX], this.completedNumberColorClass);
      this.renderer.addClass(this.arrDomChildren[step.resultArr.length - 1], this.completedNumberColorClass);
    }
  }
}
