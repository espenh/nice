export function jsonLog(thing) {
    console.log(JSON.stringify(thing, null, 2));
}
export async function delay(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
    });
}
//# sourceMappingURL=generalUtils.js.map