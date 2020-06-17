import { Action } from '@ngrx/store';
import { QuickSortStep } from 'src/app/models/quick-sort/QuickSortStep';

export const ADD_QUICK_SORT_HISTORY = 'ADD_QUICK_SORT_HISTORY',
    DELETE_QUICK_SORT_HISTORY = 'DELETE_QUICK_SORT_HISTORY';

export class AddQuickSortHistory implements Action {
    readonly type = ADD_QUICK_SORT_HISTORY;

    constructor(public payload: QuickSortStep[]) { }
}

export class DeleteQuickSortHistory implements Action {
    readonly type = DELETE_QUICK_SORT_HISTORY;

    constructor() { }
}
export type QuickSortActions =
    | AddQuickSortHistory
    | DeleteQuickSortHistory;