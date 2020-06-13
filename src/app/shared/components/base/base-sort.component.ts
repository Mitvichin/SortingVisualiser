import { OnDestroy, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, Component, AfterViewInit, OnInit, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { calculateElementsHeight } from '../../utils/calculate-elements-height';
import { BaseComponent } from './base.component';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import { takeUntil } from 'rxjs/operators';
import { areArrsEqual } from '../../utils/are-arrs-equal';
import { SortService } from '../../interfaces/SortService';
import { BaseSortStep } from 'src/app/models/shared/BaseSortStep';
import { BaseState } from '../../interfaces/BaseState';
import * as fromVisualizerActions from '../../../components/visualizer/store/visualizer.actions';
import { deepCopy } from '../../utils/deep-copy';
import { delay } from '../../utils/delay';
import { Actions, ofType } from '@ngrx/effects'
import { BaseSortEffects } from '../../base-effects/base-sort.effects';

@Component({
  selector: 'base-sort',
})
export abstract class BaseSortComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('arrContainer') protected arrContainer: ElementRef;
  @ViewChild('arrContainer', { read: ViewContainerRef }) protected arrContainerReff: ViewContainerRef;
  @Output() sortCompleted = new EventEmitter();

  protected arrDomChildren: any = [];
  protected itemSwapDistance: number = 0;
  protected DOMElWidth: number = 0;
  protected DOMElMargin: number = 2; //px
  protected iterationSpeed: number = 0; // in milliseconds
  protected illustrativeArr: number[];
  protected initialArr: number[];
  protected currentArr: number[];
  protected shouldUseInitialArr: boolean;
  protected currentIndex: number = 0;
  protected sortHistory: any[];
  protected resetIllustrativeArr: boolean = false;
  protected isCompleted: boolean = false;
  protected shouldStart: boolean;
  protected shouldPause: boolean;

  protected comparedPairColorClass:string;
  protected completedNumberColorClass:string;
  
  constructor(
    protected store: Store<fromApp.AppState>,
    protected renderer: Renderer2,
    protected detector: ChangeDetectorRef,
    protected sortService: SortService,
    protected baseEffects: BaseSortEffects,
    private storeDeleteAction: any,
    private selector: (state: fromApp.AppState) => BaseState
  ) {
    super();
  }

  abstract visualise(sortHistory: BaseSortStep[]): void

  ngOnInit(): void {
    this.store.select(fromApp.StateSelector.selectOptions).subscribe(data => {
      this.comparedPairColorClass = data.comparedPairColor;
      this.completedNumberColorClass = data.completedNumberColor;
    })

    this.store.select(this.selector).pipe(takeUntil(this.$unsubscribe)).subscribe(storeData => {
      let data = deepCopy(storeData);

      this.sortHistory = data.sortingHistory;
      if (this.sortHistory.length > 0) {
        this.visualise([...this.sortHistory]);
      }
    })

    this.store.select(fromApp.StateSelector.selectVisualizer).pipe(takeUntil(this.$unsubscribe)).subscribe(async storeData => {
      let data: typeof storeData = deepCopy(storeData);

      if (data.shouldStart) {
        if (data.shouldUseInitialArr) {
          this.illustrativeArr = data.initialArr;
        } else {
          this.illustrativeArr = data.currentArr;
        }
      }

      this.initialArr = data.initialArr;
      this.currentArr = data.currentArr;
      this.shouldUseInitialArr = data.shouldUseInitialArr;
      this.shouldPause = data.shouldPause;
      this.shouldStart = data.shouldStart;
    })

    this.baseEffects.$deleteSortHistory.pipe(
      takeUntil(this.$unsubscribe)).subscribe(() => {
        this.detector.detectChanges();
        calculateElementsHeight(this.renderer, this.arrDomChildren as HTMLElement[], this.DOMElMargin)
        this.currentIndex = 0;

        this.store.dispatch(this.storeDeleteAction)
      })
  }

  ngAfterViewInit() {
    this.arrDomChildren = this.arrContainer.nativeElement.children;
    calculateElementsHeight(this.renderer, this.arrDomChildren as HTMLElement[], this.DOMElMargin)
  }

  async sort() {
    if (this.shouldUseInitialArr) {
      this.illustrativeArr = [...this.initialArr];
    } else {
      this.illustrativeArr = [...this.currentArr];
    }

    if (this.sortHistory.length > 0) {
      this.visualise([...this.sortHistory]);
      return;
    }

    this.sortService.sort(this.illustrativeArr);
    if (this.isCompleted) {
      this.reset();
    }
  }

  async reset() {
    this.currentIndex = 0;
    this.isCompleted = false;
    if (this.sortHistory.length > 0) {
      this.store.dispatch(this.storeDeleteAction);
    }

    let temp = [...this.illustrativeArr];
    this.illustrativeArr = [];
    this.detector.detectChanges();
    this.illustrativeArr = temp;
    await delay(50);
    calculateElementsHeight(this.renderer, this.arrDomChildren as HTMLElement[], this.DOMElMargin)
  }

  ngOnDestroy(): void {
    if (this.sortHistory.length > 0) {
      this.store.dispatch(this.storeDeleteAction);
    }

    super.ngOnDestroy();
  }
}