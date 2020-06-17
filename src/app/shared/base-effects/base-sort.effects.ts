import { Actions, ofType, Effect } from '@ngrx/effects'
import { Injectable } from '@angular/core';
import * as VisualizerActions from '../../components/visualizer/store/visualizer.actions';

@Injectable()
export class BaseSortEffects {

    constructor(private $actions: Actions) { }

    @Effect({dispatch:false})
    readonly $deleteSortHistory = this.$actions.pipe(ofType(VisualizerActions.SAVE_RANDOM_ARR))
}