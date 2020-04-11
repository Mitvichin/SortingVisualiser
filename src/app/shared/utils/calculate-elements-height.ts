import { Renderer2 } from '@angular/core';
import { delay } from './delay';

export async function calculateElementsHeight(renderer: Renderer2, arr: HTMLElement[]) {
    const maxHeight = 95, // the max height a element can be in percentage of the its parent;
        minHeight = 28; // the min height a element can be in px; 
    let sumOfArr = 0,
        unit = 0, // represents 1 unit of height for the elemnts in the arr;
        tempHeight = 0;
    for (const el of arr) {
        sumOfArr += +el.innerHTML;
    }

    unit = maxHeight / sumOfArr;

    for (const el of arr) {
        renderer.setStyle(el, 'transition', 'none');
        renderer.setStyle(el, 'height', `${+el.innerHTML * unit}%`);
        tempHeight = el.getBoundingClientRect().height;
        renderer.setStyle(el, 'height', `0px`);
        await delay(50)
        renderer.setStyle(el, 'transition', '0.5s ease-out');
        renderer.setStyle(el, 'height', `${tempHeight + minHeight}px`); // sets the height + defaut value;
        renderer.setStyle(el, 'opacity', '1');
    }
}