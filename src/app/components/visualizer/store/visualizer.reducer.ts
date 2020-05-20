import { VisualizerActions } from './visualizer.actions';
import * as fromVisualizerActions from './visualizer.actions';

export interface State {
    currentArr: number[];
    initialArr: number[];
    shouldUseInitialArr: boolean;
    isVisualizing: boolean;
    shouldDeleteHistory: boolean;
}

const initialState: State = {
    currentArr: [12, 3, 4, 16, 2, 100],
    initialArr: [12, 3, 4, 16, 2, 100],
    shouldUseInitialArr: true,
    isVisualizing: false,
    shouldDeleteHistory: false
}

export function visualizerReducer(state: State = initialState, action: VisualizerActions) {
    switch (action.type) {
        case fromVisualizerActions.ADD_CURRENT_ARR:
            return {
                ...state,
                currentArr: [...action.payload]
            }
        case fromVisualizerActions.GENERATE_RANDOM_ARR:
        return {
                ...state,
                currentArr: [...action.payload],
                initialArr: [...action.payload],
                shouldDeleteHistory: true
            }
        case fromVisualizerActions.CHANGE_SOURCE_ARR:
            return {
                ...state,
                shouldUseInitialArr: action.payload
            }
        case fromVisualizerActions.TOGGLE_VISUALIZING:
            return {
                ...state,
                isVisualizing: !state.isVisualizing,
                shouldDeleteHistory: false
            }
        default:
            return state;
    }
}