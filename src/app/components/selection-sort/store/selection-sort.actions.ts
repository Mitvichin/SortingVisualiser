import { Action } from '@ngrx/store';
import { SelectionSortStep } from '../../../models/selection-sort/SelectionSortStep';

export const ADD_ARR = 'ADD_ARR';
export const ADD_SELECTION_SORT_HISTORY = 'ADD_SELECTION_SORT_HISTORY';
export const CHANGE_SWAP_INDEX = 'CHANGE_SWAP_POINT';

export class AddArr implements Action {
    readonly type = ADD_ARR;

    constructor(public payload: number[]) { }
}

export class AddSelectionSortHistory implements Action {
    readonly type = ADD_SELECTION_SORT_HISTORY;

    constructor(public payload: SelectionSortStep[]) { }
}

export type SelectionSortActions =
    AddArr
    | AddSelectionSortHistory