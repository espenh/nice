export function jsonLog(thing: any) {
    console.log(JSON.stringify(thing, null, 2));
}

export async function delay(ms: number) {
    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), ms);
    });
}