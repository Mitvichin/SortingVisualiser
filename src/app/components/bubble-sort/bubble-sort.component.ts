import { Component, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { BubbleSortService } from './bubble-sort.service';
import { Store } from '@ngrx/store';
import { BubbleSortStep } from '../../models/bubble-sort/BubbleSortStep';
import * as fromApp from '../../store/app.reducer';
import * as fromBubbleSortActions from '../bubble-sort/store/bubble-sort.actions';
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
  asd: Subscription;

  constructor(
    private sortService: BubbleSortService,
    private store: Store<fromApp.AppState>,
    private renderer: Renderer2, ) {
    super();
  }


  ngOnInit(): void {
    this.asd = this.store.select('bubbleSort').pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      this.illustrativeArr = [...data.currentArray];
      this.visualise(data.sortingHistory);
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
      }
    }
  }

  async sort() {
    this.sortService.bubleSort(this.illustrativeArr, ascendingSort);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromBubbleSortActions.DeleteBubbleSortHistory());
    super.ngOnDestroy();
  }
}
