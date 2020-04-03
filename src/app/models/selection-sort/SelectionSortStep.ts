import { BaseSortStep } from '../shared/BaseSortStep';
import { ComparedCouple } from '../shared/ComparedCouple';

export class SelectionSortStep extends BaseSortStep {

    constructor(public swapIndex?: number,
        public minValueIndex?: number,
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