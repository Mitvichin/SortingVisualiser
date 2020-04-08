import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { QuickSortService } from './quick-sort.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { QuickSortStep } from 'src/app/models/quick-sort/QuickSortStep';
import { delay } from '../../utils/delay';
import { swapElements } from '../../utils/swapElements';

@Component({
  selector: 'quick-sort',
  templateUrl: './quick-sort.component.html',
  styleUrls: ['./quick-sort.component.scss']
})
export class QuickSortComponent implements OnInit {
  @ViewChild('arrContainer') arrContainer: ElementRef;
  arrDomChildren: any;
  itemSwapDistance: number = 0;
  DOMElWidth: number = 120;
  iterationSpeed: number = 1000; // in milliseconds
  illustrativeArr: number[];

  constructor(
    private store: Store<fromApp.AppState>,
    private sortService: QuickSortService,
    private renderer: Renderer2) { }

  ngOnInit(): void {
    this.store.select('quickSort').subscribe(data => {
      this.illustrativeArr = [...data.currentArr];
      this.visualise(data.sortingHistory);
    })
  }

  ngAfterViewInit(): void {
    console.log(this.arrContainer)
    this.arrDomChildren = this.arrContainer.nativeElement.children;
  }

  async visualise(sortHistory: QuickSortStep[]) {
    if (sortHistory.length > 0) {
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
      }
    }
  }

  sort() {
    this.sortService.quickSort(this.illustrativeArr);
  }
}
