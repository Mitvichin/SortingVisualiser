import { BubbleSortStep } from 'src/app/models/bubble-sort/BubbleSortStep';
import { SelectionSortStep } from 'src/app/models/selection-sort/SelectionSortStep';
import { QuickSortStep } from 'src/app/models/quick-sort/QuickSortStep';

export interface BaseState {
    sortingHistory: BubbleSortStep[] | SelectionSortStep[] | QuickSortStep[];
}