import { Action } from '@ngrx/store';

export const ADD_ARR = 'ADD_ARR';

export class AddArr implements Action {
    readonly type = ADD_ARR;
    
    constructor(public payload: number[]) { }
}

export type VisualiserActions = AddArr;