import { Component, OnInit, Renderer2, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Option } from 'src/app/shared/interfaces/Option';
import * as fromApp from '../../store/app.reducer';
import * as fromOptionsActions from './store/options.actions';
import { Store } from '@ngrx/store';
import { takeUntil, take } from 'rxjs/operators';
import { ColorOptions } from 'src/app/shared/constants/color-options';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  completedNumberColors: Option[] = [];
  compairedPairColors: Option[] = [];
  smallerNumberColors: Option[] = [];
  itemsToBeSwapedColors: Option[] = [];
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.createColorClasses();
    this.markSelectedColorsAsChecked();
  }

  changeCompletedNumberColor(option: Option) {
    this.changeSelectedValue(option, this.completedNumberColors);
    this.store.dispatch(new fromOptionsActions.ChangeCompletedNumberColor(option.value));
  }

  changeCompairedPairColor(option: Option) {
    this.changeSelectedValue(option, this.compairedPairColors);
    this.store.dispatch(new fromOptionsActions.ChangeComparedPairColor(option.value));
  }

  changeSmallerNumberColor(option: Option) {
    this.changeSelectedValue(option, this.smallerNumberColors);
    this.store.dispatch(new fromOptionsActions.ChangeSmallerNumberColor(option.value));
  }

  changeItemsToBeSwaped(option: Option) {
    this.changeSelectedValue(option, this.itemsToBeSwapedColors);
    this.store.dispatch(new fromOptionsActions.ChangeItemsToBeSwapedColor(option.value));
  }

  private changeSelectedValue(option: Option, arr: Array<Option>) {
    arr.find(x => x.isSelected === true).isSelected = false;
    arr.find(x => x.value === option.value).isSelected = true;
  }

  private createColorClasses() {
    let stringifiedColors = JSON.stringify(ColorOptions.options);

    this.completedNumberColors = JSON.parse(stringifiedColors);
    this.compairedPairColors = JSON.parse(stringifiedColors);
    this.smallerNumberColors = JSON.parse(stringifiedColors);
    this.itemsToBeSwapedColors = JSON.parse(stringifiedColors);
  }

  private markSelectedColorsAsChecked() {
    this.store.select(fromApp.StateSelector.selectOptions).pipe(take(1)).subscribe(data => {
      this.completedNumberColors.find(x => x.value === data.completedNumberColor).isSelected = true;
      this.compairedPairColors.find(x => x.value === data.comparedPairColor).isSelected = true;
      this.smallerNumberColors.find(x => x.value === data.smallerNumberColor).isSelected = true;
      this.itemsToBeSwapedColors.find(x => x.value === data.itemsToBeSwapedColor).isSelected = true;
    });
  }
}
