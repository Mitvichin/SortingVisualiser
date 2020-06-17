export function areArrsEqual(x: Array<number>, y: Array<number>){
    
    if(JSON.stringify(x) === JSON.stringify(y)){
        return true;
    }

    return false;
}
