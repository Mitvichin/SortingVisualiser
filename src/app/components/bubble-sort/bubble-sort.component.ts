import { Component, OnInit, Renderer2, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BubbleSortService } from './bubble-sort.service';
import { Store } from '@ngrx/store';
import { BubbleSortStep } from '../../models/bubble-sort/BubbleSortStep';
import * as fromApp from '../../store/app.reducer';
import * as fromBubbleSortActions from '../bubble-sort/store/bubble-sort.actions';
import * as fromVisualizerActions from '../visualizer/store/visualizer.actions';
import { delay } from '../../shared/utils/delay';
import { BaseSortComponent } from 'src/app/shared/components/base/base-sort.component';

@Component({
  selector: 'bubble-sort',
  templateUrl: './bubble-sort.component.html',
  styleUrls: ['./bubble-sort.component.scss'],
})
export class BubbleSortComponent extends BaseSortComponent implements OnInit, OnDestroy {

  constructor(
    protected sortService: BubbleSortService,
    protected store: Store<fromApp.AppState>,
    protected renderer: Renderer2,
    protected detector: ChangeDetectorRef) {
    super(
      store,
      renderer,
      detector,
      sortService,
      new fromBubbleSortActions.DeleteBubbleSortHistory(),
      fromApp.StateSelector.selectBubbleSort);
  }


  ngOnInit(): void {
    super.ngOnInit();
  }

  async visualise(sortHistory: BubbleSortStep[]) {
    
    this.DOMElWidth = (this.arrDomChildren[0] as HTMLElement).getBoundingClientRect().width + this.DOMElMargin * 2; // *2 because we have 2 sides with 2px margin
    sortHistory = sortHistory.splice(this.currentIndex, sortHistory.length); // splicing the original history incase the pause btn was pressed and we need to continue from where we paused

    if (sortHistory.length > 0) {
      this.store.dispatch(new fromVisualizerActions.ChangeSourceArr(false));
      //used for of because it can be async
      for (const { el, i } of sortHistory.map((el, i) => ({ el, i }))) {
        if (!this.isVisualizing) return;

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
          if (i === sortHistory.length - 1) {
            this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexX], 'completed');
          }
        }

        this.currentIndex = ++this.currentIndex;
        this.store.dispatch(new fromVisualizerActions.AddCurrentArr(el.resultArr));

        if (!this.isVisualizing) return;
      }

      this.store.dispatch(new fromVisualizerActions.ToggleVisualizing());
    }
    // this will happen only if you dont stop the visualization by force
    this.currentIndex = 0;
    this.sortHistory = [];
  }

  // ngOnDestroy(): void {
  //   this.store.dispatch(new fromBubbleSortActions.DeleteBubbleSortHistory());
  //   if (this.isVisualizing) {
  //     this.store.dispatch(new fromVisualizerActions.ToggleVisualizing())
  //   }

  //   super.ngOnDestroy();
  // }
}
