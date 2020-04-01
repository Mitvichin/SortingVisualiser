import { Action } from '@ngrx/store';
import { BubbleSortStep } from './../../../models/bubble-sort/BubbleSortStep';

export const ADD_ARR = 'ADD_ARR';
export const ADD_BUBBLE_SORT_HISTORY = 'ADD_BUBBLE_SORT_HISTORY';

export class AddArr implements Action {
    readonly type = ADD_ARR;

    constructor(public payload: number[]) { }
}

export class AddBubbleSortHistory implements Action {
    readonly type = ADD_BUBBLE_SORT_HISTORY;

    constructor(public payload: BubbleSortStep[]) { }
}

export type fromBubbleSortActions = AddArr | AddBubbleSortHistory;