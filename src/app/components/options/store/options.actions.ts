import { Action } from '@ngrx/store';

export const CHANGE_COMPAIRED_PAIR_COLOR = 'CHANGE_COMPAIRED_PAIR_COLOR',
    CHANGE_SMALLER_NUMBER_COLOR = 'CHANGE_SMALLER_NUMBER_COLOR',
    CHANGE_COMPLETED_NUMBER_COLOR = 'CHANGE_COMPLETED_NUMBER_COLOR',
    CHANGE_ITEMS_TO_BE_SWAPPED_COLOR = 'CHANGE_ITEMS_TO_BE_SWAPPED_COLOR',
    CHANGE_PIVOT_COLOR = 'CHANGE_PIVOT_COLOR',
    CHANGE_SWAP_INDEX_COLOR = 'CHANGE_SWAP_INDEX_COLOR',
    CHANGE_SMALLEST_NUMBER_COLOR = 'CHANGE_SMALLEST_NUMBER_COLOR';



export class ChangeComparedPairColor implements Action {
    readonly type = CHANGE_COMPAIRED_PAIR_COLOR;

    constructor(public payload: string) { }
}

export class ChangeSmallerNumberColor implements Action {
    readonly type = CHANGE_SMALLER_NUMBER_COLOR;

    constructor(public payload: string) { }
}

export class ChangeCompletedNumberColor implements Action {
    readonly type = CHANGE_COMPLETED_NUMBER_COLOR;

    constructor(public payload: string) { }
}

export class ChangeItemsToBeSwapedColor implements Action {
    readonly type = CHANGE_ITEMS_TO_BE_SWAPPED_COLOR;

    constructor(public payload: string) { }
}

export type OptionsActions =
    ChangeComparedPairColor
    | ChangeSmallerNumberColor
    | ChangeCompletedNumberColor
    | ChangeItemsToBeSwapedColor;