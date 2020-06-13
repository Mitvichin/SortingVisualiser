import * as fromOptionsActions from './options.actions';
import { DefaultColors } from 'src/app/shared/constants/default-colors';

export interface State {
    comparedPairColor: string;
    smallerNumberColor: string;
    completedNumberColor: string;
    itemsToBeSwapedColor: string;
};

const initialState: State = {
    comparedPairColor: DefaultColors.compairedPairColor,
    smallerNumberColor: DefaultColors.smallerNumberColor,
    completedNumberColor: DefaultColors.completedNumberColor,
    itemsToBeSwapedColor: DefaultColors.itemsToBeSwapedColor,
};

export function optionsReducer(state: State = initialState, action: fromOptionsActions.OptionsActions) {
    switch (action.type) {
        case fromOptionsActions.CHANGE_COMPAIRED_PAIR_COLOR:
            return {
                ...state,
                comparedPairColor: action.payload
            }
        case fromOptionsActions.CHANGE_SMALLER_NUMBER_COLOR:
            return {
                ...state,
                comparedPairColor: action.payload
            }
        case fromOptionsActions.CHANGE_COMPLETED_NUMBER_COLOR:
            return {
                ...state,
                completedNumberColor: action.payload
            }
        case fromOptionsActions.CHANGE_ITEMS_TO_BE_SWAPPED_COLOR:
            return {
                ...state,
                itemsToBeSwapedColor: action.payload
            }
        default:
            return state;
    }
}