import { Action } from '@ngrx/store';
import * as VisualiserActions from './visualiser.actions';

const initialState = {
    array: [6,5,4,3,2,1]
}

export function visualiserReducer(state = initialState, action: VisualiserActions.VisualiserActions){

    switch(action.type){
        case VisualiserActions.ADD_ARR:
            return {
                ...state,
                array: action.payload
            }
        default:
            return state;
            

        
    }


}