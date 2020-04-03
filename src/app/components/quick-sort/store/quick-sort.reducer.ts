import * as fromQuickSortActions from './quick-sort.actions';

export interface State {
    currentArr: number[];
    sortingHistory: any[];
}

const initialState: State = {
    currentArr: [6, 5, 4, 3, 50,80, 100],
    sortingHistory: [] = [],
}

export function quickSortReducer(state: State = initialState, action: fromQuickSortActions.QuickSortActions) {
    switch (action.type) {
        case fromQuickSortActions.ADD_ARR:
            return {
                ...state,
                currentArr: action.payload
            }
        case fromQuickSortActions.ADD_QUICK_SORT_HISTORY:
            return {
                ...state,
                sortingHistory: action.payload
            }
        default:
            return initialState;
    }
}