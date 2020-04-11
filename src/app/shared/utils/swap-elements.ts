export function swapElements(x, y, arr: any[]) {
    let temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;
}