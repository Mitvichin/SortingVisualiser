import { Renderer2 } from '@angular/core';
import { delay } from './delay';

export async function calculateElementsHeight(renderer: Renderer2, arr: HTMLElement[], margin: number) {
    const maxHeight = 95, // we don't want to use all of the avaiable height;
        minHeight = 28,// the min height a element can be in px; 
        usableWidth = 95; // we don't want to use all of the avaiable width;
    let hUnit = 0, // represents 1 unit of height for the elements in the arr;
        wUnit = 0, // represents 1 unit of width for the elements in the arr;
        tempHeight = 0,
        maxValue = -1,
        tempChildValue = 0;

    for (const el of arr) {

        tempChildValue = +el.children[0].innerHTML;

        if (maxValue < tempChildValue) {
            maxValue = tempChildValue;
        }
    }

    hUnit = maxHeight / maxValue;
    wUnit = usableWidth / arr.length;
    await delay(100);
    for (const el of arr) {
        renderer.setStyle(el, 'transition', 'none');
        renderer.setStyle(el, 'height', `${+el.children[0].innerHTML * hUnit}%`);
        renderer.setStyle(el, 'width', `${wUnit}%`);
        renderer.setStyle(el, 'margin', `${margin}px`);
        tempHeight = el.getBoundingClientRect().height;
        renderer.setStyle(el, 'height', `0px`);
        if (arr.length > 6 && arr.length < 12) {
            renderer.setStyle(el, 'font-size', '16px')
        } else if (arr.length > 12) {
            renderer.setStyle(el, 'font-size', '12px')
        }
        renderer.setStyle(el, 'transition', '0.5s ease-out');
        renderer.setStyle(el, 'opacity', '1');
        renderer.setStyle(el, 'height', `${tempHeight + minHeight}px`); // sets the height + defaut value;
    }
}