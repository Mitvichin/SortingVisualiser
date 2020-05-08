import * as fromBubbleSort from '../components/bubble-sort/store/bubble-sort.reducer';
import * as fromSelectionSort from '../components/selection-sort/store/selection-sort.reducer';
import * as fromQuickSort from '../components/quick-sort/store/quick-sort.reducer';
import * as fromVisualizer from '../components/visualizer/store/visualizer.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
    bubbleSort: fromBubbleSort.State;
    selectionSort: fromSelectionSort.State;
    quickSort: fromQuickSort.State;
    visualizer: fromVisualizer.State;

}

export const appReducer: ActionReducerMap<AppState> = {
    bubbleSort: fromBubbleSort.bubbleSortReducer,
    selectionSort: fromSelectionSort.selectionSortReducer,
    quickSort: fromQuickSort.quickSortReducer,
    visualizer: fromVisualizer.visualizerReducer,
}