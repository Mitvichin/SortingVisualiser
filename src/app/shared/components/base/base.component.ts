import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector:'base-component'
})
export class BaseComponent implements OnDestroy {
  $unsubscribe: Subject<any>;

  constructor() {
    this.$unsubscribe = new Subject();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
