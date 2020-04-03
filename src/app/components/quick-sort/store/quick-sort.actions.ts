import { Action } from '@ngrx/store';

export const ADD_ARR = 'ADD_ARR';
export const ADD_QUICK_SORT_HISTORY = 'ADD_QUICK_SORT_HISTORY';

export class AddArr implements Action {
    readonly type = ADD_ARR;

    constructor(public payload: number[]) { }
}

export class AddQuickSortHistory implements Action {
    readonly type = ADD_QUICK_SORT_HISTORY;

    constructor(public payload: any[]) { }
}

export type QuickSortActions =
    AddArr
    | AddQuickSortHistory;