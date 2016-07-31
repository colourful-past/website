export function wait(ms:number) : Promise<void>
{
    console.log("waiting", {ms});
    return new Promise<void>((resolve, reject) =>{
        setTimeout(() => resolve(), ms);
    })
}

export function randomOne<T>(items:Array<T>) : T
{
    return items[Math.floor(Math.random()*items.length)]
}

export function getRandomDouble(min:number, max:number) {
    return Math.random() * (max - min) + min;
}

export function getRandomInt(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}