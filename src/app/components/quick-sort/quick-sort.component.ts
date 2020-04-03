import { Component, OnInit } from '@angular/core';
import { QuickSortService } from './quick-sort.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-quick-sort',
  templateUrl: './quick-sort.component.html',
  styleUrls: ['./quick-sort.component.scss']
})
export class QuickSortComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>, private sortingService: QuickSortService) { }

  ngOnInit(): void {
    this.store.select('quickSort').subscribe(data => {
      console.log(this.sortingService.sort(data.currentArr, 0, data.currentArr.length - 1))
    })
  }

}
