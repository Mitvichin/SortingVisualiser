import { Component, OnInit, Renderer2, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BubbleSortService } from './bubble-sort.service';
import { Store } from '@ngrx/store';
import { BubbleSortStep } from '../../models/bubble-sort/BubbleSortStep';
import * as fromApp from '../../store/app.reducer';
import * as fromBubbleSortActions from '../bubble-sort/store/bubble-sort.actions';
import * as fromVisualizerActions from '../visualizer/store/visualizer.actions';

import { delay } from '../../shared/utils/delay';
import { BaseSortComponent } from 'src/app/shared/components/base/base-sort.component';
import { BaseSortEffects } from 'src/app/shared/base-effects/base-sort.effects';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bubble-sort',
  templateUrl: './bubble-sort.component.html',
  styleUrls: ['./bubble-sort.component.scss'],
})
export class BubbleSortComponent extends BaseSortComponent implements OnInit, OnDestroy {

  private smallerNumberColorClass;

  constructor(
    protected sortService: BubbleSortService,
    protected store: Store<fromApp.AppState>,
    protected renderer: Renderer2,
    protected detector: ChangeDetectorRef,
    protected baseEffects: BaseSortEffects) {
    super(
      store,
      renderer,
      detector,
      sortService,
      baseEffects,
      new fromBubbleSortActions.DeleteBubbleSortHistory(),
      fromApp.StateSelector.selectBubbleSort);
  }


  ngOnInit(): void {
    super.ngOnInit();

    this.store.select(fromApp.StateSelector.selectOptions).pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      this.smallerNumberColorClass = data.smallerNumberColor;
    })
  }

  async visualise(sortHistory: BubbleSortStep[]) {
    this.DOMElWidth = (this.arrDomChildren[0] as HTMLElement).getBoundingClientRect().width + this.DOMElMargin * 2; // *2 because we have 2 sides with 2px margin
    sortHistory = sortHistory.splice(this.currentIndex, sortHistory.length); // splicing the original history incase the pause btn was pressed and we need to continue from where we paused

    if (sortHistory.length > 0) {
      this.store.dispatch(new fromVisualizerActions.ChangeSourceArr(false));
      //used "for of" because it can be async
      for (const { el, i } of sortHistory.map((el, i) => ({ el, i }))) {

        this.itemSwapDistance = Math.abs(el.comparedCouple.indexX - el.comparedCouple.indexY) * this.DOMElWidth;
        // increases the speed of the iteration
        await delay(this.iterationSpeed);
        this.illustrativeArr = [...el.startingArr];

        this.addCompairedPairColorClass(el);

        await delay(500);
        if (el.didSwap) {
          await this.swapElements(el);
        } else {
          this.indicateSmallerNumber(el.comparedCouple.indexX);
        }

        await delay(500);
        this.illustrativeArr = [...el.resultArr];

        if (el.didSwap) {
          this.preserveElementsLocation(el);
        }

        await this.removeIndicatorColorClasses(el);

        if (el.didSwap) {
          this.addTransitionToElements(el);
        }

        if (el.isCompleted) {
          this.markAsComplete(el, i, sortHistory);
        }

        this.currentIndex = ++this.currentIndex;
        this.store.dispatch(new fromVisualizerActions.AddCurrentArr(el.resultArr));

        if (this.shouldPause) {
          this.pauseVisualization();
          return;
        }
      }

      this.pauseVisualization();
    }
    // this will happen only if you dont stop the visualization by force
    this.afterSortIsCompleted();
  }

  private addCompairedPairColorClass(el: any) {
    this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexX], this.comparedPairColorClass);
    this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexY], this.comparedPairColorClass);
  }

  private indicateSmallerNumber(index: number) {
    this.renderer.removeClass(this.arrDomChildren[index], this.comparedPairColorClass);
    this.renderer.addClass(this.arrDomChildren[index], this.smallerNumberColorClass);
  }

  private async swapElements(el: BubbleSortStep) {
    this.indicateSmallerNumber(el.comparedCouple.indexY)
    await delay(500);
    this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transform", `translate(${this.itemSwapDistance}px)`);
    this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transform", `translate(-${this.itemSwapDistance}px)`);
  }

  private preserveElementsLocation(el: BubbleSortStep) {
    this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transition", '0s');
    this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transition", '0s');
    this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transform", 'translate(0)');
    this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transform", 'translate(0)');
    delay(200);
  }

  private async removeIndicatorColorClasses(el: BubbleSortStep) {
    await delay(200);
    this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexX], this.comparedPairColorClass);
    this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexY], this.comparedPairColorClass);
    this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexX], this.smallerNumberColorClass);
    this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexY], this.smallerNumberColorClass);
  }

  private addTransitionToElements(el: BubbleSortStep) {
    this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transition", '.5s ease-in-out');
    this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transition", '.5s ease-in-out');
  }

  private markAsComplete(el: BubbleSortStep, i: number, sortHistory: BubbleSortStep[]) {
    this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexY], this.completedNumberColorClass);
    if (i === sortHistory.length - 1) {
      this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexX], this.completedNumberColorClass);
    }
  }
}
