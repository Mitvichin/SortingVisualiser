import * as fromBubbleSortActions from './bubble-sort.actions';
import { BubbleSortStep } from '../../../models/bubble-sort/BubbleSortStep';

export interface State {
    currentArray: number[];
    sortingHistory: BubbleSortStep[],
}

const initialState: State = {
    currentArray: [100, 6, 4, 3, 2, 1],
    sortingHistory: [] = new Array<BubbleSortStep>(),
}

export function bubbleSortReducer(state = initialState, action: fromBubbleSortActions.BubbleSortActions) {

    switch (action.type) {
        case fromBubbleSortActions.ADD_ARR:
            return {
                ...state,
                array: action.payload
            }
        case fromBubbleSortActions.ADD_BUBBLE_SORT_HISTORY:
            return {
                ...state,
                sortingHistory: action.payload
            }
        default:
            return state;



    }


}