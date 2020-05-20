import * as fromQuickSortActions from './quick-sort.actions';
import { QuickSortStep } from 'src/app/models/quick-sort/QuickSortStep';
import { BaseState } from 'src/app/shared/interfaces/BaseState';

export interface State extends BaseState {
    currentArr: number[];
    sortingHistory: QuickSortStep[];
}

const initialState: State = {
    currentArr: [6, 5, 4, 3, 50, 100, 80],
    sortingHistory:[] = new Array<QuickSortStep>(),
}

export function quickSortReducer(state: State = initialState, action: fromQuickSortActions.QuickSortActions) {
    switch (action.type) {
        case fromQuickSortActions.ADD_ARR:
            return {
                ...state,
                currentArr: [...action.payload]
            }
        case fromQuickSortActions.ADD_QUICK_SORT_HISTORY:
            return {
                ...state,
                sortingHistory: [...action.payload]
            }
        case fromQuickSortActions.DELETE_QUICK_SORT_HISTORY:
            return {
                ...state,
                sortingHistory: []
            }
        default:
            return state;
    }
}