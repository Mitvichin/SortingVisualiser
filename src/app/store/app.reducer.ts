import * as fromBubbleSort from '../components/bubble-sort/store/bubble-sort.reducer';
import * as fromSelectionSort from '../components/selection-sort/store/selection-sort.reducer'
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
    bubbleSort: fromBubbleSort.State;
    selectionSort: fromSelectionSort.State

}

export const appReducer: ActionReducerMap<AppState> = {
    bubbleSort: fromBubbleSort.bubbleSortReducer,
    selectionSort: fromSelectionSort.selectionSortReducer,
}