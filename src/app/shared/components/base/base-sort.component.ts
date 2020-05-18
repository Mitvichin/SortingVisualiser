import { OnDestroy, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, Component, AfterViewInit, OnInit } from '@angular/core';
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

@Component({
  selector: 'base-sort',
})
export abstract class BaseSortComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('arrContainer') protected arrContainer: ElementRef;

  protected arrDomChildren: any = [];
  protected itemSwapDistance: number = 0;
  protected DOMElWidth: number = 0;
  protected DOMElMargin: number = 2; //px
  protected iterationSpeed: number = 0; // in milliseconds
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
    protected sortService: SortService,
    private storeDeleteAction: any,
    private selector: (state: fromApp.AppState) => BaseState
  ) {
    super();
  }

  abstract visualise(sortHistory: BaseSortStep[]): void

  ngOnInit(): void {
    this.store.select(this.selector).pipe(takeUntil(this.$unsubscribe)).subscribe(storeData => {
      let data = deepCopy(storeData);

      this.sortHistory = data.sortingHistory;
      if (this.sortHistory.length > 0) {
        this.visualise([...this.sortHistory]);
      }
    })

    this.store.select(fromApp.StateSelector.selectVisualizer).pipe(takeUntil(this.$unsubscribe)).subscribe(async storeData => {
      let data = deepCopy(storeData);

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

        if (this.sortHistory.length > 0) {
          this.store.dispatch(this.storeDeleteAction)
        }
      }
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
  }

  ngOnDestroy(): void {
    if (this.sortHistory.length > 0) {
      this.store.dispatch(this.storeDeleteAction);
    }

    if (this.isVisualizing) {
      this.store.dispatch(new fromVisualizerActions.ToggleVisualizing())
    }
    super.ngOnDestroy();
  }
}