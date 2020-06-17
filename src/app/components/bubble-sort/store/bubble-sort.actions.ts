import { Action } from '@ngrx/store';
import { BubbleSortStep } from './../../../models/bubble-sort/BubbleSortStep';

export const ADD_BUBBLE_SORT_HISTORY = 'ADD_BUBBLE_SORT_HISTORY',
    DELETE_BUBBLE_SORT_HISTORY = 'DELETE_BUBBLE_SORT_HISTORY';

export class AddBubbleSortHistory implements Action {
    readonly type = ADD_BUBBLE_SORT_HISTORY;

    constructor(public payload: BubbleSortStep[]) { }
}

export class DeleteBubbleSortHistory implements Action {
    readonly type = DELETE_BUBBLE_SORT_HISTORY;

    constructor() { }
}

export type BubbleSortActions =
    | AddBubbleSortHistory
    | DeleteBubbleSortHistory;