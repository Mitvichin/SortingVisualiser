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


@Component({
  selector: 'quick-sort',
  templateUrl: './quick-sort.component.html',
  styleUrls: ['./quick-sort.component.scss']
})
export class QuickSortComponent extends BaseSortComponent implements OnInit, AfterViewInit, OnDestroy {

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
  }

  async visualise(sortHistory: QuickSortStep[]) {
    this.DOMElWidth = (this.arrDomChildren[0] as HTMLElement).getBoundingClientRect().width + this.DOMElMargin * 2; // *2 because we have 2 sides with 2px margin
    sortHistory = sortHistory.splice(this.currentIndex, sortHistory.length); // splicing the original history incase the pause btn was pressed and we need to continue from where we paused

    if (sortHistory.length > 0) {
      this.store.dispatch(new fromVisualizerActions.ChangeSourceArr(false));
      //used for of because it can be async
      for (const { i, el } of sortHistory.map((el, i) => ({ i, el }))) {

        if (el.didSwap)
          this.itemSwapDistance = Math.abs(el.comparedCouple.indexX - el.comparedCouple.indexY) * this.DOMElWidth;
        // increases the speed of the iteration
        await delay(this.iterationSpeed);

        // initialises them temporary step
        this.illustrativeArr = [...el.startingArr];

        // visualizes the pivot index in the array
        await delay(500)
        this.renderer.addClass(this.arrDomChildren[el.pivotIndex], 'pivot');

        // visualizes the two compared numbers
        await delay(500)
        if (el.comparedCouple && el.didSwap === false) {
          this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexX], 'comparedCouple');
          this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexY], 'comparedCouple');
        }

        if (el.leftValueIndex !== undefined) {
          await delay(500)
          this.renderer.addClass(this.arrDomChildren[el.leftValueIndex], 'itemToSwap')

          if (el.rightValueIndex !== undefined) {
            this.renderer.addClass(this.arrDomChildren[el.rightValueIndex], 'itemToSwap')
            await delay(500);
          }
        }

        if (el.didSwap) {

          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transform", `translate(${this.itemSwapDistance}px)`);
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transform", `translate(-${this.itemSwapDistance}px)`);

          if (el.leftValueIndex !== undefined) {
            await delay(500);
            this.renderer.removeClass(this.arrDomChildren[el.leftValueIndex], 'itemToSwap');

            if (el.rightValueIndex !== undefined)
              this.renderer.removeClass(this.arrDomChildren[el.rightValueIndex], 'itemToSwap');
          }
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

        await delay(500);
        if (el.comparedCouple && el.didSwap == false) {
          this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexX], 'comparedCouple');
          this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexY], 'comparedCouple');
        }

        if (el.didSwap) {
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transition", '.5s ease-in-out');
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transition", '.5s ease-in-out');
        }

        if (el.isCompleted) {
          let pivotIndex = el.resultArr.indexOf(el.pivotValue);
          this.renderer.addClass(this.arrDomChildren[pivotIndex], 'completed');
          this.renderer.removeClass(this.arrDomChildren[pivotIndex], 'pivot');

          if (el.leftValueIndex !== undefined) {
            await delay(500);
            this.renderer.removeClass(this.arrDomChildren[el.leftValueIndex], 'itemToSwap');

            if (el.rightValueIndex !== undefined)
              this.renderer.removeClass(this.arrDomChildren[el.rightValueIndex], 'itemToSwap');
          }
        }

        this.currentIndex = ++this.currentIndex;
        this.store.dispatch(new fromVisualizerActions.AddCurrentArr(el.resultArr));

        if (this.shouldPause){
          this.store.dispatch(new fromVisualizerActions.ShouldPauseVisualization(false));
          this.store.dispatch(new fromVisualizerActions.ShouldStartVisualization(true));
          return;
        } 
      }

      this.store.dispatch(new fromVisualizerActions.ShouldPauseVisualization(false));
      this.store.dispatch(new fromVisualizerActions.ShouldStartVisualization(true));
    }

    // this will happen only if you dont stop the visualization by force
    this.currentIndex = 0;
    this.sortHistory = [];
    this.isCompleted = true;
    this.sortCompleted.emit();
  }
}
