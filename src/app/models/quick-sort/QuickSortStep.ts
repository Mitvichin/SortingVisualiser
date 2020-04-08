import { BaseSortStep } from '../shared/BaseSortStep';
import { ComparedCouple } from '../shared/ComparedCouple';

export class QuickSortStep extends BaseSortStep {
    constructor(public pivotIndex?: number,
        public pivotValue?: number,
        public leftValueIndex?: number,
        public rightValueIndex?: number,
        comparedCouple?: ComparedCouple,
        didSwap?: boolean,
        startingArr?: number[],
        resultArr?: number[],
        isCompleted?: boolean, ) {

        super(comparedCouple,
            didSwap,
            startingArr,
            resultArr,
            isCompleted);
    }
}