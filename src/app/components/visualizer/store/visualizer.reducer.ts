import { VisualizerActions } from './visualizer.actions';
import * as fromVisualizerActions from './visualizer.actions';

export interface State {
    currentArr: number[];
    initialArr: number[];
    shouldUseInitialArr: boolean;
    shouldPause:boolean;
    shouldStart: boolean
}

const initialState: State = {
    currentArr: [1, 396, 346, 447, 111, 305,231,300,268,173,182,112],
    initialArr: [1, 396, 346, 447, 111, 305,231,300,268,173,182,112],
    shouldUseInitialArr: true,
    shouldPause: false,
    shouldStart: true,
}

export function visualizerReducer(state: State = initialState, action: VisualizerActions) {
    switch (action.type) {
        case fromVisualizerActions.ADD_CURRENT_ARR:
            return {
                ...state,
                currentArr: [...action.payload]
            }
        case fromVisualizerActions.SAVE_RANDOM_ARR:
        return {
                ...state,
                currentArr: [...action.payload],
                initialArr: [...action.payload],
            }
        case fromVisualizerActions.CHANGE_SOURCE_ARR:
            return {
                ...state,
                shouldUseInitialArr: action.payload
            }
        case fromVisualizerActions.SHOUD_PAUSE_VISUALIZATION:
            return {
                ...state,
                shouldPause: action.payload
            }    
        case fromVisualizerActions.SHOUD_START_VISUALIZATION:
            return{
                ...state,
                shouldStart: action.payload
            }    
        default:
            return state;
    }
}