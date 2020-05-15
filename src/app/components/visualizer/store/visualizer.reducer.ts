import { VisualizerActions } from './visualizer.actions';
import * as fromVisualizerActions from './visualizer.actions';

export interface State {
    currentArr: number[];
    initialArr: number[];
    shouldUseInitialArr: boolean;
    isVisualizing: boolean;
}

const initialState: State = {
    currentArr: [12, 3, 4, 16, 2, 100],
    initialArr: [12, 3, 4, 16, 2, 100],
    shouldUseInitialArr: true,
    isVisualizing: false,
}

export function visualizerReducer(state: State = initialState, action: VisualizerActions) {
    switch (action.type) {
        case fromVisualizerActions.ADD_CURRENT_ARR:
            return {
                ...state,
                currentArr: [...action.payload]
            }
        case fromVisualizerActions.ADD_INITIAL_ARR:
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
        case fromVisualizerActions.TOGGLE_VISUALIZING:
            return {
                ...state,
                isVisualizing: !state.isVisualizing
            }
        default:
            return state;
    }
}