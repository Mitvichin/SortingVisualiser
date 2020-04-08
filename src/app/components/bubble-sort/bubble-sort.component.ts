import { Component, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BubbleSortService } from './bubble-sort.service';
import { Store } from '@ngrx/store';
import { BubbleSortStep } from '../../models/bubble-sort/BubbleSortStep';
import { ComparedCouple } from '../../models/shared/ComparedCouple';
import * as fromApp from '../../store/app.reducer';
import { delay } from '../../utils/delay';
import { ascendingSort, descendingSort } from '../../shared/functions/sorting-predicates';

@Component({
  selector: 'bubble-sort',
  templateUrl: './bubble-sort.component.html',
  styleUrls: ['./bubble-sort.component.scss'],
})
export class BubbleSortComponent implements OnInit, AfterViewInit {
  @ViewChild('arrContainer') arrContainer: ElementRef;
  arrDomChildren: any;
  itemSwapDistance: number = 0;
  DOMElWidth: number = 120;
  iterationSpeed: number = 0; // in milliseconds
  illustrativeArr: number[];

  constructor(
    private sortService: BubbleSortService,
    private store: Store<fromApp.AppState>,
    private renderer: Renderer2, ) { }

  ngOnInit(): void {
    this.store.select('bubbleSort').subscribe(data => {
      this.illustrativeArr = [...data.currentArray];
      this.visualise(data.sortingHistory);
    })
  }

   ngAfterViewInit() {
    this.arrDomChildren = this.arrContainer.nativeElement.children;
     this.calculateElHeight();
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
    this.sortService.bubleSort(this.illustrativeArr, descendingSort);
    //this.sortingService.selectionSort(this.tempStep.arr);
  }

  async calculateElHeight() {
    let valueOfArr = 0,
      unit = 0;
    for (let index = 0; index < this.arrDomChildren.length; index++) {
      valueOfArr += +this.arrDomChildren[index].innerHTML;
    }
    unit = 95 / valueOfArr;
    
    
    for (const el of this.arrDomChildren) {
      console.log(+el.innerHTML)
      this.renderer.setStyle(el, 'transition', 'none');
      this.renderer.setStyle(el, 'opacity', '0');
      this.renderer.setStyle(el, 'height', `${+el.innerHTML * unit}%`);
      let temp = el.getBoundingClientRect().height;
      this.renderer.setStyle(el, 'height', `0px`);
      await delay(50)
      this.renderer.setStyle(el, 'transition', '0.5s ease-out');
      this.renderer.setStyle(el, 'opacity', '1');
      this.renderer.setStyle(el, 'height', `${temp +28}px`);
    }

  }

  rnd() {
    return "rnd";
  }
}
