import { Component, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SelectionSortService } from './selection-sort.service';
import { SelectionSortStep } from 'src/app/models/selection-sort/SelectionSortStep';
import { ComparedCouple } from 'src/app/models/shared/ComparedCouple';
import { Store } from '@ngrx/store';
import { delay } from 'src/app/utils/delay';
import * as fromApp from './../../store/app.reducer';

@Component({
  selector: 'selection-sort',
  templateUrl: './selection-sort.component.html',
  styleUrls: ['./selection-sort.component.scss']
})
export class SelectionSortComponent implements OnInit, AfterViewInit {
  @ViewChild('arrContainer') arrContainer: ElementRef;
  arrDomChildren: any;
  itemSwapDistance: number = 0;
  DOMElWidth: number = 120;
  iterationSpeed: number = 1000; // in milliseconds
  illustrativeArr: number[];

  constructor(
    private store: Store<fromApp.AppState>,
    private sortService: SelectionSortService,
    private renderer: Renderer2, ) { }

  ngOnInit(): void {
    this.store.select('selectionSort').subscribe(data => {
      this.illustrativeArr = [...data.currentArr];
      this.visualise(data.sortingHistory);
    })
  }

  ngAfterViewInit(): void {
    console.log(this.arrContainer)
    this.arrDomChildren = this.arrContainer.nativeElement.children;
  }

  async visualise(sortHistory: SelectionSortStep[]) {
    if (sortHistory.length > 0) {
      let smallestIndex = -1;
      //used for of because it can be async
      for (const { i, el } of sortHistory.map((el, i) => ({ i, el }))) {
        this.itemSwapDistance = Math.abs(el.comparedCouple.indexX - el.comparedCouple.indexY) * this.DOMElWidth;
        // increases the speed of the iteration
        await delay(this.iterationSpeed);

        // initialises them temporary step
        this.illustrativeArr = [...el.startingArr];
        
        this.renderer.addClass(this.arrDomChildren[el.swapIndex], 'swapIndex');
        await delay(500)
        // visualizes the two compared numbers
        if(!el.didSwap){
          this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexX], 'comparedCouple');
          this.renderer.addClass(this.arrDomChildren[el.comparedCouple.indexY], 'comparedCouple');
        }

        if(smallestIndex !== el.minValueIndex && smallestIndex !== -1){
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
        if(!el.didSwap){
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
      }
    }
  }

  async sort() {
    this.sortService.selectionSort(this.illustrativeArr);
  }

}
