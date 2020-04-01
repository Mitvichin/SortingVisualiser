import * as fromBubbleSortActions from './bubble-sort.actions';
import { BubbleSortStep } from '../../../models/bubble-sort/BubbleSortStep';

export interface State {
    initialArray: number[];
    bubbleSortHistory: BubbleSortStep[],
}

const initialState: State = {
    initialArray: [6, 5, 4, 3, 2, 1],
    bubbleSortHistory: [] = new Array<BubbleSortStep>(),
}

export function bubbleSortReducer(state = initialState, action: fromBubbleSortActions.fromBubbleSortActions) {

    switch (action.type) {
        case fromBubbleSortActions.ADD_ARR:
            return {
                ...state,
                array: action.payload
            }
        case fromBubbleSortActions.ADD_BUBBLE_SORT_HISTORY:
            var tempArr = [...action.payload];
            return {
                ...state,
                bubbleSortHistory: tempArr
            }
        default:
            return state;



    }


}