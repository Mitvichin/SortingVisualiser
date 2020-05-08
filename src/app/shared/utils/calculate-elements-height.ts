import { Renderer2 } from '@angular/core';
import { delay } from './delay';

export async function calculateElementsHeight(renderer: Renderer2, arr: HTMLElement[]) {
    const maxHeight = 95, // the max height a element can be in percentage of the its parent;
        minHeight = 28,// the min height a element can be in px; 
        usableWidth = 95; // we don't want to use all of the avaiable width
    let sumOfArr = 0,
        hUnit = 0,
        wUnit = 0, // represents 1 unit of height for the elemnts in the arr;
        tempHeight = 0;

    for (const el of arr) {
        sumOfArr += +el.children[0].innerHTML;
    }

    hUnit = maxHeight / sumOfArr;
    wUnit = usableWidth / arr.length;

    for (const el of arr) {
        renderer.setStyle(el, 'transition', 'none');
        renderer.setStyle(el, 'height', `${+el.children[0].innerHTML * hUnit}%`);
        renderer.setStyle(el, 'width', `${wUnit}%`);
        renderer.setStyle(el, 'margin', `2px`);
        tempHeight = el.getBoundingClientRect().height;
        renderer.setStyle(el, 'height', `0px`);
        await delay(50)
        if(arr.length > 6 && arr.length < 12){
            renderer.setStyle(el,'font-size','16px')
        }else if(arr.length > 12){
            renderer.setStyle(el,'font-size','12px')
        }
        renderer.setStyle(el, 'transition', '0.5s ease-out');
        renderer.setStyle(el, 'height', `${tempHeight + minHeight}px`); // sets the height + defaut value;
        renderer.setStyle(el, 'opacity', '1');
    }
}