import { OnDestroy, ViewChild, ElementRef, Renderer2, Injector, ChangeDetectorRef, Component, AfterViewInit, OnInit, Type } from '@angular/core';
import { calculateElementsHeight } from '../../utils/calculate-elements-height';
import { BaseComponent } from './base.component';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as fromBubbleSortActions from '../../../components/bubble-sort/store/bubble-sort.actions';
import { takeUntil } from 'rxjs/operators';
import { BubbleSortComponent } from 'src/app/components/bubble-sort/bubble-sort.component';
import { areArrsEqual } from '../../utils/are-arrs-equal';

@Component({
  selector: 'base-sort',
})
export abstract class BaseSortComponent extends BaseComponent implements OnInit,AfterViewInit, OnDestroy {
  @ViewChild('arrContainer') protected arrContainer: ElementRef;

  protected arrDomChildren: any = [];
  protected itemSwapDistance: number = 0;
  protected DOMElWidth: number = 0;
  protected DOMElMargin: number = 2; //px
  protected iterationSpeed: number = 1000; // in milliseconds
  protected illustrativeArr: number[];
  protected initialArr: number[];
  protected currentArr: number[];
  protected shouldUseInitialArr: boolean;
  protected isVisualizing: boolean = false;
  protected currentIndex: number = 0;
  protected sortHistory: any[];

  constructor(
    protected store: Store<fromApp.AppState>,
    protected renderer: Renderer2,
    protected detector: ChangeDetectorRef,
    private childType: any,
  ) {
    super();
    console.log(childType);

  }

  ngOnInit(): void {
    this.store.select('bubbleSort').pipe(takeUntil(this.$unsubscribe)).subscribe(data => {
      this.sortHistory = [...data.sortingHistory];
      if (this.sortHistory.length > 0) {
        this.visualise([...this.sortHistory]);
      }
    })
    
    this.store.select('visualizer').pipe(takeUntil(this.$unsubscribe)).subscribe(async storeData => {
      let data = { ...storeData };

      if (!data.isVisualizing)
        if (data.shouldUseInitialArr) {
          this.illustrativeArr = data.initialArr;
        } else {
          this.illustrativeArr = data.currentArr;
        }


      this.initialArr = data.initialArr;
      this.currentArr = data.currentArr;
      this.shouldUseInitialArr = data.shouldUseInitialArr;
      this.isVisualizing = data.isVisualizing;

      if (areArrsEqual(this.initialArr, this.currentArr) && !data.isVisualizing) {
        this.detector.detectChanges();
        calculateElementsHeight(this.renderer, this.arrDomChildren as HTMLElement[], this.DOMElMargin)
        this.currentIndex = 0;
          // TODO: Put this in separate method
        if(this.childType === BubbleSortComponent.name){
          this.store.dispatch(new fromBubbleSortActions.DeleteBubbleSortHistory())
        }
      }
    })
  }

  ngAfterViewInit() {
    this.arrDomChildren = this.arrContainer.nativeElement.children;
    calculateElementsHeight(this.renderer, this.arrDomChildren as HTMLElement[], this.DOMElMargin)
  }

  abstract visualise(sortHistory: any[]) :void

}