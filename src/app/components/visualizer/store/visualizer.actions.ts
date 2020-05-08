import { Action } from '@ngrx/store';

export const ADD_CURRENT_ARR = "ADD_CURRENT_ARR",
    ADD_INITIAL_ARR = "ADD_INITIAL_ARR",
    CHANGE_SOURCE_ARR = "CHANGE_SOURCE_ARR";

export class AddCurrentArr implements Action {
    readonly type = ADD_CURRENT_ARR;

    constructor(public payload: number[]) { }
}

export class AddInitialArr implements Action {
    readonly type = ADD_INITIAL_ARR;

    constructor(public payload: number[]) { }
}

export class ChangeSourceArr implements Action {
    readonly type = CHANGE_SOURCE_ARR;

    constructor() { }
}

export type VisualizerActions =
    AddCurrentArr
    | AddInitialArr
    | ChangeSourceArr;