import { Component, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BubbleSortService } from './bubble-sort.service';
import { Store } from '@ngrx/store';
import { BubbleSortStep } from '../../models/bubble-sort/BubbleSortStep';
import { ComparedCouple } from '../../models/shared/ComparedCouple';
import * as fromApp from '../../store/app.reducer';
import { delay } from '../../utils/delay';
import { ascendingSort, descendingSort } from '../../shared/functions/sorting-predicates';

@Component({
  selector: 'bubble-sorting-visualser',
  templateUrl: './bubble-sort.component.html',
  styleUrls: ['./bubble-sort.component.scss'],
})
export class BubbleSortComponent implements OnInit, AfterViewInit {
  @ViewChild('arrContainer') arrContainer: ElementRef;
  arrDomChildren: any;
  result: BubbleSortStep = new BubbleSortStep();
  itemSwapDistance: number = 0;
  DOMElWidth: number = 120;
  iterationSpeed: number = 0; // in milliseconds
  tempStep = {
    comparedCouple: undefined as ComparedCouple,
    didSwap: undefined,
    arr: undefined,
  };

  constructor(
    private sortService: BubbleSortService,
    private store: Store<fromApp.AppState>,
    private renderer: Renderer2, ) { }

  ngOnInit(): void {
    this.store.select('visualiser').subscribe(data => {
      this.tempStep.arr = [...data.initialArray];
      this.visualise(data.bubbleSortHistory);
    })
  }

  ngAfterViewInit(): void {
    this.arrDomChildren = this.arrContainer.nativeElement.children;
  }

  async visualise(bubbleSortHistory: BubbleSortStep[]) {
    if (bubbleSortHistory.length > 0) {
      //used for of because it can be async
      for (const { i, el } of bubbleSortHistory.map((el, i) => ({ i, el }))) {
        this.itemSwapDistance = Math.abs(el.comparedCouple.indexX - el.comparedCouple.indexY) * this.DOMElWidth;
        // increases the speed of the iteration
        await delay(this.iterationSpeed);
        this.tempStep.didSwap = el.didSwap;
        this.tempStep.comparedCouple = el.comparedCouple;
        this.tempStep.arr = [...el.startingArr];

        this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexX], 'curr');
        this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexY], 'next');
        if (el.didSwap) {
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transform", `translate(${this.itemSwapDistance}px)`);
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transform", `translate(-${this.itemSwapDistance}px)`);
        }

        await delay(500);
        this.tempStep.arr = [...el.resultArr];
        if (el.didSwap) {
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transition", '0s');
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transition", '0s');
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexX], "transform", 'translate(0)');
          this.renderer.setStyle(this.arrDomChildren[el.comparedCouple.indexY], "transform", 'translate(0)');
          delay(200);
        }

        await delay(200);
        this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexX], 'next');
        this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexY], 'curr');
        this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexY], 'next');
        this.renderer.removeClass(this.arrDomChildren[el.comparedCouple.indexX], 'curr');
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
    this.sortService.bubleSort(this.tempStep.arr, ascendingSort);
    //this.sortingService.selectionSort(this.tempStep.arr);
  }
  
  rnd() {
    return "rnd";
  }
}
