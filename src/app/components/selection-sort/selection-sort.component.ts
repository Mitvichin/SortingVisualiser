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
      for (const { i, el } of sortHistory.map((el, i) => ({ i, el }))) {
        if (!this.isVisualizing) return;

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

        this.currentIndex = ++this.currentIndex;
        this.store.dispatch(new fromVisualizerActions.AddCurrentArr(el.resultArr));
        if (!this.isVisualizing){
          await delay(50); return;
        } 
      }

      this.store.dispatch(new fromVisualizerActions.ToggleVisualizing());
    }
    // this will happen only if you dont stop the visualization by force
    this.currentIndex = 0;
    this.sortHistory = [];
    this.isCompleted = true;
  }
}
