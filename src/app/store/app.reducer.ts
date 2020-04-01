import * as fromBubbleSort from '../components/bubble-sort/store/bubble-sort.reducer';
import { ActionReducerMap } from '@ngrx/store';
import { from } from 'rxjs';

export interface AppState {
    visualiser: fromBubbleSort.State;
}

export const appReducer: ActionReducerMap<AppState> = {
visualiser: fromBubbleSort.bubbleSortReducer,
}