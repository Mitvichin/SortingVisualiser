import * as fromBubbleSortActions from './bubble-sort.actions';
import { BubbleSortStep } from '../../../models/bubble-sort/BubbleSortStep';
import { BaseState } from 'src/app/shared/interfaces/BaseState';

export interface State extends BaseState{
    sortingHistory: BubbleSortStep[],
}

const initialState: State = {
    sortingHistory: [] = new Array<BubbleSortStep>(),
}

export function bubbleSortReducer(state:State = initialState, action: fromBubbleSortActions.BubbleSortActions) {
    
    switch (action.type) {
        case fromBubbleSortActions.ADD_BUBBLE_SORT_HISTORY:
            return {
                ...state,
                sortingHistory: [...action.payload]
            }
        case fromBubbleSortActions.DELETE_BUBBLE_SORT_HISTORY:
            return {
                ...state,
                sortingHistory: []
            }
        default:
            return state;
    }
}