"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.jsonLog = void 0;
function jsonLog(thing) {
    console.log(JSON.stringify(thing, null, 2));
}
exports.jsonLog = jsonLog;
async function delay(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
    });
}
exports.delay = delay;
