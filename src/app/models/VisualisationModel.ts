export class VisualisationModel {
    swappingCouple: { x: number, x1: number }
     completedIndexes: number[] = [];
    pivot?: number;


    constructor() {
        this.swappingCouple = { x: -1, x1: -1 }

    }

    addCompletedIndex(i: number) {
        this.completedIndexes.push(i);
    }

    checkIfCompleted(val:number){
        return this.completedIndexes.includes(val);
    }
}