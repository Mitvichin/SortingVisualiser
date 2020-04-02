import { SelectionSortStep } from '../../../models/selection-sort/SelectionSortStep';
import * as fromSelectionSortActions from './selection-sort.actions';

export interface State {
    currentArr: number[];
    sortingHistory: SelectionSortStep[];
}

const initialState: State = {
    currentArr: [6, 5, 4, 3, 2, 1],
    sortingHistory: [] = new Array<SelectionSortStep>(),
}

export function selectionSortReducer(state: State = initialState, action: fromSelectionSortActions.SelectionSortActions) {

    switch (action.type) {
        case fromSelectionSortActions.ADD_ARR:
            return {
                ...state,
                currentArr: action.payload
            }
        case fromSelectionSortActions.ADD_SELECTION_SORT_HISTORY:
            return {
                ...state,
                sortingHistory: action.payload
            }
        default:
            return initialState;
    }
}