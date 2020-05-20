import { Action } from '@ngrx/store';
import { BaseSortComponent } from 'src/app/shared/components/base/base-sort.component';

export const ADD_CURRENT_ARR = "ADD_CURRENT_ARR",
    GENERATE_RANDOM_ARR = "GENERATE_RANDOM_ARR",
    CHANGE_SOURCE_ARR = "CHANGE_SOURCE_ARR",
    TOGGLE_VISUALIZING = "TOGGLE_VISUALIZING";

export class AddCurrentArr implements Action {
    readonly type = ADD_CURRENT_ARR;

    constructor(public payload: number[]) { }
}

export class GenerateRandomArr implements Action {
    readonly type = GENERATE_RANDOM_ARR;

    constructor(public payload: number[]) { }
}

export class ChangeSourceArr implements Action {
    readonly type = CHANGE_SOURCE_ARR;

    constructor(public payload:boolean) { }
}

export class ToggleVisualizing implements Action {
    readonly type =  TOGGLE_VISUALIZING;

    constructor() { }
}

export type VisualizerActions =
    AddCurrentArr
    | GenerateRandomArr
    | ChangeSourceArr
    | ToggleVisualizing;