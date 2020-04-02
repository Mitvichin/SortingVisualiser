import { BaseSortClass } from '../shared/BaseSortStep';
import { ComparedCouple } from '../shared/ComparedCouple';

export class SelectionSortStep extends BaseSortClass {

    constructor(public swapIndex?: number,
        public swapIndexValue?: number,
        comparedCouple?: ComparedCouple,
        didSwap?: boolean,
        startingArr?: number[],
        resultArr?: number[],
        isCompleted?: boolean, ) {

        super(comparedCouple ? comparedCouple : undefined,
            didSwap ? didSwap : undefined,
            startingArr ? startingArr : undefined,
            resultArr ? resultArr : undefined,
            isCompleted ? isCompleted : undefined);
    }
}