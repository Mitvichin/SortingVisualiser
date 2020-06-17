import { ComparedCouple } from './ComparedCouple';

export class BaseSortStep {
    constructor(
        public comparedCouple?: ComparedCouple,
        public didSwap?: boolean,
        public startingArr?: number[],
        public resultArr?: number[],
        public isCompleted?: boolean,
    ) { }
}