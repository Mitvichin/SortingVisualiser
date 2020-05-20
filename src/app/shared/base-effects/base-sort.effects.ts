import { Actions, ofType, Effect } from '@ngrx/effects'
import { Injectable } from '@angular/core';
import * as VisualizerActions from '../../components/visualizer/store/visualizer.actions';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class BaseSortEffects {

    constructor(private $actions: Actions) { }

    @Effect({dispatch:false})
    readonly $deleteSortHistory = this.$actions.pipe(ofType(VisualizerActions.GENERATE_RANDOM_ARR))
}