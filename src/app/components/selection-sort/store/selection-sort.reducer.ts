import { SelectionSortStep } from '../../../models/selection-sort/SelectionSortStep';
import * as fromSelectionSortActions from './selection-sort.actions';
import { BaseState } from 'src/app/shared/interfaces/BaseState';

export interface State extends BaseState {
    sortingHistory: SelectionSortStep[];
}

const initialState: State = {
    sortingHistory: [] = new Array<SelectionSortStep>(),
}

export function selectionSortReducer(state: State = initialState, action: fromSelectionSortActions.SelectionSortActions) {

    switch (action.type) {
        case fromSelectionSortActions.ADD_SELECTION_SORT_HISTORY:
            return {
                ...state,
                sortingHistory: [...action.payload]
            }
        case fromSelectionSortActions.DELETE_SELECTION_SORT_HISTORY:
            return {
                ...state,
                sortingHistory: []
            }
        default:
            return state;
    }
}