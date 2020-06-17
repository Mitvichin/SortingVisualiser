import { Action } from '@ngrx/store';
import { SelectionSortStep } from '../../../models/selection-sort/SelectionSortStep';

export const ADD_SELECTION_SORT_HISTORY = 'ADD_SELECTION_SORT_HISTORY',
    DELETE_SELECTION_SORT_HISTORY = 'DELETE_SELECTION_SORT_HISTORY';

export class AddSelectionSortHistory implements Action {
    readonly type = ADD_SELECTION_SORT_HISTORY;

    constructor(public payload: SelectionSortStep[]) { }
}

export class DeleteSelectionSortHistory implements Action {
    readonly type = DELETE_SELECTION_SORT_HISTORY;

    constructor() { }
}

export type SelectionSortActions =
    | AddSelectionSortHistory
    | DeleteSelectionSortHistory;
