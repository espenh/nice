/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./packages/nice-common/src/action/actionDirector.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getActionDirectorMessageHandler = exports.ActionDirector = void 0;
const tslib_1 = __webpack_require__("tslib");
const color_1 = tslib_1.__importDefault(__webpack_require__("color"));
const _ = tslib_1.__importStar(__webpack_require__("lodash"));
const effectsCollection_1 = __webpack_require__("./packages/nice-common/src/effects/effectsCollection.ts");
const highlightObjectEffect_1 = __webpack_require__("./packages/nice-common/src/effects/highlightObjectEffect.ts");
const ledOcclusion_1 = __webpack_require__("./packages/nice-common/src/utils/ledOcclusion.ts");
const movingObjectState_1 = __webpack_require__("./packages/nice-common/src/action/movingObjectState.ts");
const placedObjectState_1 = __webpack_require__("./packages/nice-common/src/action/placedObjectState.ts");
class ActionDirector {
    constructor(ledStatus, ledClient, getNow) {
        this.ledStatus = ledStatus;
        this.ledClient = ledClient;
        this.getNow = getNow;
        // TODO - These should not be public.
        this.objectState = new placedObjectState_1.PlacedObjectState();
        this.movingState = new movingObjectState_1.MovingObjectState();
        this.currentlyAffectedLedIndexes = [];
        this.findOccludedLedsMemoized = _.memoize((rectangle) => {
            return this.ledStatus.leds.filter((led) => (0, ledOcclusion_1.isOccluded)(led.position, rectangle));
        });
        this.effectCollection = new effectsCollection_1.EffectsCollection();
        setInterval(async () => {
            const now = this.getNow();
            const timeSinceLast = this.lastTickTime === undefined ? 0 : now - this.lastTickTime;
            try {
                await this.tick(timeSinceLast);
            }
            catch (error) {
                // TODO - Silent for now as it's mostly connection issues for when the lights service isn't started.
                // Add a check on startup to see that we have all required services ready.
                // Kill this interval if we fail x times in a row.
            }
            finally {
                this.lastTickTime = this.getNow();
            }
        }, 30);
    }
    placeObject(object) {
        this.objectState.placeObject(object);
    }
    removePlacedObject(objectId) {
        this.objectState.removeObject(objectId);
    }
    processMovingObjects() {
        // Any moving objects nearby placed objects?
        const movingState = this.movingState.getState();
        const placedState = this.objectState.getState();
        if (movingState.movingObjects.length === 0 ||
            placedState.placedObjects.length === 0) {
            return;
        }
        // Ignore movement in areas where we have effects going on.
        const movingObjectsNotToClose = movingState.movingObjects.filter((m) => {
            if (this.currentlyAffectedLedIndexes.length === 0) {
                return true;
            }
            for (const { led } of this.currentlyAffectedLedIndexes) {
                const a = m.coordinate.x - led.position.x;
                const b = m.coordinate.y - led.position.y;
                const distance = Math.sqrt(a * a + b * b);
                // TODO - EH changed. Verify still works. Was "return distance > 500".
                if (distance > 500) {
                    return true;
                }
            }
            return false;
        });
        // Find placed objects that are intersecting with movement.
        for (const movingObject of movingObjectsNotToClose) {
            const intersectingFixed = placedState.placedObjects.find((p) => (0, ledOcclusion_1.isOccluded)(movingObject.coordinate, p.rectangle));
            if (intersectingFixed) {
                // Apply effect to "hit" object.
                this.effectCollection.add(new highlightObjectEffect_1.HighlightObjectEffect(intersectingFixed));
            }
        }
    }
    async tick(ellapsedMilliseconds) {
        this.processMovingObjects();
        // Find occluded leds by placed object.
        const state = this.objectState.getState();
        const objectsOccludingLeds = state.placedObjects
            .map((object) => {
            const leds = this.findOccludedLedsMemoized(object.rectangle);
            return {
                object,
                leds,
            };
        })
            .filter((x) => x.leds.length > 0);
        const frameFromPlacedObjects = _.fromPairs(_.flatten(objectsOccludingLeds.map((o) => {
            const color = (0, color_1.default)(o.object.color);
            const rgb = { r: color.red(), g: color.green(), b: color.blue() };
            return o.leds.map((l) => [l.index, rgb]);
        })));
        // Apply any effects.
        const { frame, affectedLedIndexes } = this.effectCollection.tick(ellapsedMilliseconds, frameFromPlacedObjects, { ledInfo: this.ledStatus, placedObject: state.placedObjects });
        // Store all leds affected by effects.
        this.currentlyAffectedLedIndexes.push(...affectedLedIndexes
            .map((index) => this.ledStatus.leds.find((led) => led.index === index))
            .map((led) => {
            return {
                led: led,
                time: this.getNow(),
            };
        }));
        // No need to send the same frame.
        if (this.previousLightSent && _.isEqual(this.previousLightSent, frame)) {
            return;
        }
        try {
            this.previousLightSent = frame;
            await this.ledClient.turnOnLights(frame);
        }
        catch (error) {
            console.log("Failed turning on lights." + JSON.stringify(error));
        }
        // Remove ignore status of leds that have been part of a highlight more than x seconds ago.
        const now = this.getNow();
        this.currentlyAffectedLedIndexes = this.currentlyAffectedLedIndexes.filter((i) => now - i.time < 5000);
    }
}
exports.ActionDirector = ActionDirector;
const getActionDirectorMessageHandler = (director) => {
    return (action) => {
        if (action.type === "placed-object") {
            director.placeObject(action.object);
        }
        if (action.type === "placed-object-deleted") {
            director.removePlacedObject(action.objectId);
        }
        if (action.type === "trigger-effect") {
            const object = director.objectState.getObject(action.targetObjectId);
            if (object) {
                director.effectCollection.add(new highlightObjectEffect_1.HighlightObjectEffect(object));
            }
        }
        if (action.type === "detected-objects") {
            director.movingState.setObjects(action.coordinates.map((c) => ({ coordinate: c })));
        }
    };
};
exports.getActionDirectorMessageHandler = getActionDirectorMessageHandler;


/***/ }),

/***/ "./packages/nice-common/src/action/movingObjectState.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MovingObjectState = void 0;
// Some unnecessary object creation here, 
// but this class could expand if we want to 
// improve the tracking beyond basic x,y, as it's not really "tracking" currently.
class MovingObjectState {
    constructor() {
        this.movingObjects = [];
    }
    setObjects(movingObjects) {
        this.movingObjects = movingObjects;
    }
    getState() {
        return { movingObjects: this.movingObjects };
    }
}
exports.MovingObjectState = MovingObjectState;


/***/ }),

/***/ "./packages/nice-common/src/action/placedObjectState.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlacedObjectState = void 0;
class PlacedObjectState {
    constructor() {
        this.placedObjectsById = new Map();
    }
    clearCache() {
        // Iffy local caching for now. Clear when mutating.
        this.stateSnapshotCache = undefined;
    }
    placeObject(object) {
        this.placedObjectsById.set(object.id, object);
        this.clearCache();
    }
    removeObject(objectId) {
        this.placedObjectsById.delete(objectId);
        this.clearCache();
    }
    getObject(objectId) {
        return this.placedObjectsById.get(objectId);
    }
    getState() {
        if (!this.stateSnapshotCache) {
            const placedObjects = Array.from(this.placedObjectsById.values());
            this.stateSnapshotCache = {
                placedObjects
            };
        }
        return this.stateSnapshotCache;
    }
}
exports.PlacedObjectState = PlacedObjectState;


/***/ }),

/***/ "./packages/nice-common/src/data/leds.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.staticLedStatus = exports.staticLedMappingResult = void 0;
// TODO - Load from latest mapping result (json).
exports.staticLedMappingResult = {
    foundLeds: [
        {
            index: 109,
            position: {
                x: 1226,
                y: 1092,
            },
        },
        {
            index: 48,
            position: {
                x: 780,
                y: 663,
            },
        },
        {
            index: 342,
            position: {
                x: 1726,
                y: 413,
            },
        },
        {
            index: 162,
            position: {
                x: 1134,
                y: 1174,
            },
        },
        {
            index: 24,
            position: {
                x: 1125,
                y: 918,
            },
        },
        {
            index: 340,
            position: {
                x: 1758,
                y: 380,
            },
        },
        {
            index: 227,
            position: {
                x: 1078,
                y: 1174,
            },
        },
        {
            index: 120,
            position: {
                x: 1044,
                y: 520,
            },
        },
        {
            index: 373,
            position: {
                x: 1559,
                y: 444,
            },
        },
        {
            index: 67,
            position: {
                x: 819,
                y: 253,
            },
        },
        {
            index: 148,
            position: {
                x: 1161,
                y: 324,
            },
        },
        {
            index: 318,
            position: {
                x: 1819,
                y: 240,
            },
        },
        {
            index: 39,
            position: {
                x: 813,
                y: 881,
            },
        },
        {
            index: 298,
            position: {
                x: 1952,
                y: 650,
            },
        },
        {
            index: 33,
            position: {
                x: 870,
                y: 906,
            },
        },
        {
            index: 140,
            position: {
                x: 1120,
                y: 190,
            },
        },
        {
            index: 396,
            position: {
                x: 1418,
                y: 164,
            },
        },
        {
            index: 90,
            position: {
                x: 873,
                y: 486,
            },
        },
        {
            index: 193,
            position: {
                x: 1398,
                y: 316,
            },
        },
        {
            index: 322,
            position: {
                x: 1788,
                y: 171,
            },
        },
        {
            index: 34,
            position: {
                x: 844,
                y: 973,
            },
        },
        {
            index: 83,
            position: {
                x: 894,
                y: 366,
            },
        },
        {
            index: 183,
            position: {
                x: 1409,
                y: 550,
            },
        },
        {
            index: 175,
            position: {
                x: 1428,
                y: 708,
            },
        },
        {
            index: 151,
            position: {
                x: 1147,
                y: 404,
            },
        },
        {
            index: 42,
            position: {
                x: 811,
                y: 801,
            },
        },
        {
            index: 184,
            position: {
                x: 1338,
                y: 548,
            },
        },
        {
            index: 114,
            position: {
                x: 1038,
                y: 643,
            },
        },
        {
            index: 150,
            position: {
                x: 1142,
                y: 378,
            },
        },
        {
            index: 26,
            position: {
                x: 1025,
                y: 924,
            },
        },
        {
            index: 228,
            position: {
                x: 2184,
                y: 706,
            },
        },
        {
            index: 93,
            position: {
                x: 944,
                y: 553,
            },
        },
        {
            index: 237,
            position: {
                x: 2158,
                y: 525,
            },
        },
        {
            index: 101,
            position: {
                x: 996,
                y: 729,
            },
        },
        {
            index: 352,
            position: {
                x: 1717,
                y: 619,
            },
        },
        {
            index: 12,
            position: {
                x: 1432,
                y: 968,
            },
        },
        {
            index: 6,
            position: {
                x: 1598,
                y: 924,
            },
        },
        {
            index: 358,
            position: {
                x: 1710,
                y: 761,
            },
        },
        {
            index: 280,
            position: {
                x: 1991,
                y: 458,
            },
        },
        {
            index: 294,
            position: {
                x: 2014,
                y: 725,
            },
        },
        {
            index: 55,
            position: {
                x: 782,
                y: 510,
            },
        },
        {
            index: 207,
            position: {
                x: 1940,
                y: 886,
            },
        },
        {
            index: 21,
            position: {
                x: 1212,
                y: 949,
            },
        },
        {
            index: 209,
            position: {
                x: 2002,
                y: 913,
            },
        },
        {
            index: 231,
            position: {
                x: 2194,
                y: 631,
            },
        },
        {
            index: 204,
            position: {
                x: 1892,
                y: 938,
            },
        },
        {
            index: 338,
            position: {
                x: 1760,
                y: 344,
            },
        },
        {
            index: 226,
            position: {
                x: 2224,
                y: 738,
            },
        },
        {
            index: 295,
            position: {
                x: 2009,
                y: 706,
            },
        },
        {
            index: 349,
            position: {
                x: 1726,
                y: 563,
            },
        },
        {
            index: 111,
            position: {
                x: 988,
                y: 765,
            },
        },
        {
            index: 372,
            position: {
                x: 1602,
                y: 508,
            },
        },
        {
            index: 360,
            position: {
                x: 1712,
                y: 776,
            },
        },
        {
            index: 52,
            position: {
                x: 845,
                y: 535,
            },
        },
        {
            index: 123,
            position: {
                x: 1032,
                y: 438,
            },
        },
        {
            index: 153,
            position: {
                x: 1192,
                y: 432,
            },
        },
        {
            index: 270,
            position: {
                x: 1979,
                y: 264,
            },
        },
        {
            index: 121,
            position: {
                x: 1048,
                y: 481,
            },
        },
        {
            index: 88,
            position: {
                x: 873,
                y: 469,
            },
        },
        {
            index: 13,
            position: {
                x: 1454,
                y: 922,
            },
        },
        {
            index: 1,
            position: {
                x: 1721,
                y: 910,
            },
        },
        {
            index: 371,
            position: {
                x: 1635,
                y: 531,
            },
        },
        {
            index: 351,
            position: {
                x: 1733,
                y: 598,
            },
        },
        {
            index: 219,
            position: {
                x: 2180,
                y: 834,
            },
        },
        {
            index: 378,
            position: {
                x: 1552,
                y: 382,
            },
        },
        {
            index: 239,
            position: {
                x: 2110,
                y: 482,
            },
        },
        {
            index: 311,
            position: {
                x: 1852,
                y: 373,
            },
        },
        {
            index: 229,
            position: {
                x: 2206,
                y: 681,
            },
        },
        {
            index: 210,
            position: {
                x: 1994,
                y: 866,
            },
        },
        {
            index: 347,
            position: {
                x: 1724,
                y: 507,
            },
        },
        {
            index: 0,
            position: {
                x: 1740,
                y: 950,
            },
        },
        {
            index: 225,
            position: {
                x: 2226,
                y: 753,
            },
        },
        {
            index: 138,
            position: {
                x: 1094,
                y: 112,
            },
        },
        {
            index: 10,
            position: {
                x: 1516,
                y: 956,
            },
        },
        {
            index: 329,
            position: {
                x: 1718,
                y: 184,
            },
        },
        {
            index: 382,
            position: {
                x: 1532,
                y: 306,
            },
        },
        {
            index: 41,
            position: {
                x: 774,
                y: 832,
            },
        },
        {
            index: 353,
            position: {
                x: 1750,
                y: 652,
            },
        },
        {
            index: 314,
            position: {
                x: 1826,
                y: 322,
            },
        },
        {
            index: 282,
            position: {
                x: 1997,
                y: 507,
            },
        },
        {
            index: 142,
            position: {
                x: 1127,
                y: 253,
            },
        },
        {
            index: 16,
            position: {
                x: 1348,
                y: 955,
            },
        },
        {
            index: 212,
            position: {
                x: 2048,
                y: 892,
            },
        },
        {
            index: 145,
            position: {
                x: 1138,
                y: 328,
            },
        },
        {
            index: 30,
            position: {
                x: 975,
                y: 967,
            },
        },
        {
            index: 385,
            position: {
                x: 1539,
                y: 253,
            },
        },
        {
            index: 214,
            position: {
                x: 2084,
                y: 852,
            },
        },
        {
            index: 306,
            position: {
                x: 1910,
                y: 478,
            },
        },
        {
            index: 269,
            position: {
                x: 1974,
                y: 254,
            },
        },
        {
            index: 72,
            position: {
                x: 782,
                y: 169,
            },
        },
        {
            index: 23,
            position: {
                x: 1158,
                y: 958,
            },
        },
        {
            index: 103,
            position: {
                x: 993,
                y: 768,
            },
        },
        {
            index: 115,
            position: {
                x: 980,
                y: 640,
            },
        },
        {
            index: 71,
            position: {
                x: 800,
                y: 181,
            },
        },
        {
            index: 285,
            position: {
                x: 2030,
                y: 563,
            },
        },
        {
            index: 78,
            position: {
                x: 825,
                y: 309,
            },
        },
        {
            index: 384,
            position: {
                x: 1537,
                y: 264,
            },
        },
        {
            index: 144,
            position: {
                x: 1140,
                y: 255,
            },
        },
        {
            index: 259,
            position: {
                x: 1997,
                y: 143,
            },
        },
        {
            index: 5,
            position: {
                x: 1621,
                y: 908,
            },
        },
        {
            index: 85,
            position: {
                x: 897,
                y: 393,
            },
        },
        {
            index: 57,
            position: {
                x: 836,
                y: 494,
            },
        },
        {
            index: 29,
            position: {
                x: 990,
                y: 930,
            },
        },
        {
            index: 104,
            position: {
                x: 1002,
                y: 806,
            },
        },
        {
            index: 173,
            position: {
                x: 1381,
                y: 728,
            },
        },
        {
            index: 336,
            position: {
                x: 1758,
                y: 304,
            },
        },
        {
            index: 266,
            position: {
                x: 2001,
                y: 210,
            },
        },
        {
            index: 7,
            position: {
                x: 1600,
                y: 994,
            },
        },
        {
            index: 95,
            position: {
                x: 952,
                y: 614,
            },
        },
        {
            index: 366,
            position: {
                x: 1672,
                y: 628,
            },
        },
        {
            index: 348,
            position: {
                x: 1752,
                y: 540,
            },
        },
        {
            index: 176,
            position: {
                x: 1350,
                y: 677,
            },
        },
        {
            index: 389,
            position: {
                x: 1486,
                y: 190,
            },
        },
        {
            index: 383,
            position: {
                x: 1554,
                y: 318,
            },
        },
        {
            index: 330,
            position: {
                x: 1724,
                y: 202,
            },
        },
        {
            index: 65,
            position: {
                x: 817,
                y: 300,
            },
        },
        {
            index: 190,
            position: {
                x: 1390,
                y: 412,
            },
        },
        {
            index: 99,
            position: {
                x: 934,
                y: 705,
            },
        },
        {
            index: 301,
            position: {
                x: 1957,
                y: 575,
            },
        },
        {
            index: 179,
            position: {
                x: 1440,
                y: 629,
            },
        },
        {
            index: 154,
            position: {
                x: 1157,
                y: 458,
            },
        },
        {
            index: 137,
            position: {
                x: 1064,
                y: 170,
            },
        },
        {
            index: 63,
            position: {
                x: 772,
                y: 337,
            },
        },
        {
            index: 230,
            position: {
                x: 2175,
                y: 659,
            },
        },
        {
            index: 287,
            position: {
                x: 2004,
                y: 609,
            },
        },
        {
            index: 17,
            position: {
                x: 1352,
                y: 914,
            },
        },
        {
            index: 304,
            position: {
                x: 1929,
                y: 513,
            },
        },
        {
            index: 276,
            position: {
                x: 1988,
                y: 372,
            },
        },
        {
            index: 14,
            position: {
                x: 1396,
                y: 940,
            },
        },
        {
            index: 117,
            position: {
                x: 1043,
                y: 575,
            },
        },
        {
            index: 272,
            position: {
                x: 2006,
                y: 312,
            },
        },
        {
            index: 126,
            position: {
                x: 1070,
                y: 401,
            },
        },
        {
            index: 357,
            position: {
                x: 1734,
                y: 742,
            },
        },
        {
            index: 215,
            position: {
                x: 2098,
                y: 847,
            },
        },
        {
            index: 73,
            position: {
                x: 882,
                y: 162,
            },
        },
        {
            index: 256,
            position: {
                x: 2015,
                y: 189,
            },
        },
        {
            index: 307,
            position: {
                x: 1880,
                y: 464,
            },
        },
        {
            index: 168,
            position: {
                x: 1234,
                y: 766,
            },
        },
        {
            index: 182,
            position: {
                x: 1378,
                y: 550,
            },
        },
        {
            index: 388,
            position: {
                x: 1526,
                y: 196,
            },
        },
        {
            index: 172,
            position: {
                x: 1292,
                y: 785,
            },
        },
        {
            index: 293,
            position: {
                x: 2036,
                y: 739,
            },
        },
        {
            index: 8,
            position: {
                x: 1548,
                y: 957,
            },
        },
        {
            index: 296,
            position: {
                x: 1976,
                y: 690,
            },
        },
        {
            index: 242,
            position: {
                x: 2125,
                y: 427,
            },
        },
        {
            index: 139,
            position: {
                x: 1083,
                y: 175,
            },
        },
        {
            index: 261,
            position: {
                x: 1990,
                y: 134,
            },
        },
        {
            index: 189,
            position: {
                x: 1386,
                y: 402,
            },
        },
        {
            index: 159,
            position: {
                x: 1227,
                y: 566,
            },
        },
        {
            index: 305,
            position: {
                x: 1902,
                y: 503,
            },
        },
        {
            index: 58,
            position: {
                x: 783,
                y: 439,
            },
        },
        {
            index: 308,
            position: {
                x: 1870,
                y: 437,
            },
        },
        {
            index: 254,
            position: {
                x: 2033,
                y: 222,
            },
        },
        {
            index: 359,
            position: {
                x: 1729,
                y: 801,
            },
        },
        {
            index: 331,
            position: {
                x: 1712,
                y: 208,
            },
        },
        {
            index: 47,
            position: {
                x: 792,
                y: 658,
            },
        },
        {
            index: 320,
            position: {
                x: 1802,
                y: 200,
            },
        },
        {
            index: 152,
            position: {
                x: 1190,
                y: 417,
            },
        },
        {
            index: 181,
            position: {
                x: 1337,
                y: 578,
            },
        },
        {
            index: 201,
            position: {
                x: 1829,
                y: 926,
            },
        },
        {
            index: 289,
            position: {
                x: 2039,
                y: 642,
            },
        },
        {
            index: 300,
            position: {
                x: 1961,
                y: 602,
            },
        },
        {
            index: 345,
            position: {
                x: 1720,
                y: 472,
            },
        },
        {
            index: 177,
            position: {
                x: 1384,
                y: 665,
            },
        },
        {
            index: 45,
            position: {
                x: 760,
                y: 732,
            },
        },
        {
            index: 84,
            position: {
                x: 857,
                y: 388,
            },
        },
        {
            index: 166,
            position: {
                x: 1298,
                y: 712,
            },
        },
        {
            index: 28,
            position: {
                x: 1006,
                y: 978,
            },
        },
        {
            index: 370,
            position: {
                x: 1604,
                y: 559,
            },
        },
        {
            index: 36,
            position: {
                x: 820,
                y: 944,
            },
        },
        {
            index: 250,
            position: {
                x: 2078,
                y: 282,
            },
        },
        {
            index: 61,
            position: {
                x: 814,
                y: 369,
            },
        },
        {
            index: 77,
            position: {
                x: 873,
                y: 254,
            },
        },
        {
            index: 374,
            position: {
                x: 1641,
                y: 465,
            },
        },
        {
            index: 275,
            position: {
                x: 2011,
                y: 361,
            },
        },
        {
            index: 86,
            position: {
                x: 882,
                y: 430,
            },
        },
        {
            index: 222,
            position: {
                x: 2210,
                y: 812,
            },
        },
        {
            index: 326,
            position: {
                x: 1742,
                y: 146,
            },
        },
        {
            index: 147,
            position: {
                x: 1150,
                y: 309,
            },
        },
        {
            index: 32,
            position: {
                x: 926,
                y: 944,
            },
        },
        {
            index: 165,
            position: {
                x: 1259,
                y: 705,
            },
        },
        {
            index: 160,
            position: {
                x: 1206,
                y: 602,
            },
        },
        {
            index: 365,
            position: {
                x: 1684,
                y: 653,
            },
        },
        {
            index: 195,
            position: {
                x: 1393,
                y: 280,
            },
        },
        {
            index: 288,
            position: {
                x: 2036,
                y: 628,
            },
        },
        {
            index: 281,
            position: {
                x: 2023,
                y: 492,
            },
        },
        {
            index: 325,
            position: {
                x: 1746,
                y: 118,
            },
        },
        {
            index: 236,
            position: {
                x: 2138,
                y: 546,
            },
        },
        {
            index: 297,
            position: {
                x: 1983,
                y: 660,
            },
        },
        {
            index: 380,
            position: {
                x: 1540,
                y: 350,
            },
        },
        {
            index: 194,
            position: {
                x: 1390,
                y: 303,
            },
        },
        {
            index: 290,
            position: {
                x: 2036,
                y: 666,
            },
        },
        {
            index: 267,
            position: {
                x: 1972,
                y: 219,
            },
        },
        {
            index: 321,
            position: {
                x: 1768,
                y: 188,
            },
        },
        {
            index: 291,
            position: {
                x: 2004,
                y: 680,
            },
        },
        {
            index: 134,
            position: {
                x: 1053,
                y: 227,
            },
        },
        {
            index: 392,
            position: {
                x: 1495,
                y: 138,
            },
        },
        {
            index: 258,
            position: {
                x: 2004,
                y: 166,
            },
        },
        {
            index: 356,
            position: {
                x: 1743,
                y: 718,
            },
        },
        {
            index: 333,
            position: {
                x: 1751,
                y: 262,
            },
        },
        {
            index: 312,
            position: {
                x: 1874,
                y: 353,
            },
        },
        {
            index: 2,
            position: {
                x: 1695,
                y: 913,
            },
        },
        {
            index: 218,
            position: {
                x: 2153,
                y: 842,
            },
        },
        {
            index: 354,
            position: {
                x: 1712,
                y: 640,
            },
        },
        {
            index: 79,
            position: {
                x: 885,
                y: 284,
            },
        },
        {
            index: 238,
            position: {
                x: 2151,
                y: 500,
            },
        },
        {
            index: 350,
            position: {
                x: 1781,
                y: 588,
            },
        },
        {
            index: 217,
            position: {
                x: 2148,
                y: 871,
            },
        },
        {
            index: 169,
            position: {
                x: 1312,
                y: 783,
            },
        },
        {
            index: 97,
            position: {
                x: 923,
                y: 652,
            },
        },
        {
            index: 334,
            position: {
                x: 1720,
                y: 270,
            },
        },
        {
            index: 235,
            position: {
                x: 2172,
                y: 561,
            },
        },
        {
            index: 66,
            position: {
                x: 799,
                y: 264,
            },
        },
        {
            index: 279,
            position: {
                x: 2019,
                y: 446,
            },
        },
        {
            index: 54,
            position: {
                x: 800,
                y: 537,
            },
        },
        {
            index: 303,
            position: {
                x: 1907,
                y: 546,
            },
        },
        {
            index: 89,
            position: {
                x: 892,
                y: 493,
            },
        },
        {
            index: 315,
            position: {
                x: 1815,
                y: 303,
            },
        },
        {
            index: 332,
            position: {
                x: 1714,
                y: 232,
            },
        },
        {
            index: 118,
            position: {
                x: 1011,
                y: 551,
            },
        },
        {
            index: 60,
            position: {
                x: 820,
                y: 402,
            },
        },
        {
            index: 317,
            position: {
                x: 1798,
                y: 266,
            },
        },
        {
            index: 244,
            position: {
                x: 2118,
                y: 381,
            },
        },
        {
            index: 273,
            position: {
                x: 1979,
                y: 322,
            },
        },
        {
            index: 155,
            position: {
                x: 1195,
                y: 488,
            },
        },
        {
            index: 53,
            position: {
                x: 776,
                y: 555,
            },
        },
        {
            index: 344,
            position: {
                x: 1757,
                y: 452,
            },
        },
        {
            index: 46,
            position: {
                x: 802,
                y: 705,
            },
        },
        {
            index: 22,
            position: {
                x: 1183,
                y: 918,
            },
        },
        {
            index: 232,
            position: {
                x: 2160,
                y: 627,
            },
        },
        {
            index: 299,
            position: {
                x: 1944,
                y: 629,
            },
        },
        {
            index: 64,
            position: {
                x: 777,
                y: 314,
            },
        },
        {
            index: 125,
            position: {
                x: 1030,
                y: 403,
            },
        },
        {
            index: 75,
            position: {
                x: 804,
                y: 233,
            },
        },
        {
            index: 224,
            position: {
                x: 2204,
                y: 777,
            },
        },
        {
            index: 40,
            position: {
                x: 769,
                y: 861,
            },
        },
        {
            index: 188,
            position: {
                x: 1330,
                y: 427,
            },
        },
        {
            index: 27,
            position: {
                x: 1053,
                y: 958,
            },
        },
        {
            index: 119,
            position: {
                x: 1053,
                y: 536,
            },
        },
        {
            index: 128,
            position: {
                x: 1051,
                y: 386,
            },
        },
        {
            index: 245,
            position: {
                x: 2088,
                y: 371,
            },
        },
        {
            index: 240,
            position: {
                x: 2138,
                y: 465,
            },
        },
        {
            index: 283,
            position: {
                x: 2030,
                y: 522,
            },
        },
        {
            index: 262,
            position: {
                x: 1967,
                y: 134,
            },
        },
        {
            index: 264,
            position: {
                x: 1971,
                y: 166,
            },
        },
        {
            index: 377,
            position: {
                x: 1561,
                y: 446,
            },
        },
        {
            index: 38,
            position: {
                x: 778,
                y: 908,
            },
        },
        {
            index: 196,
            position: {
                x: 1426,
                y: 268,
            },
        },
        {
            index: 205,
            position: {
                x: 1908,
                y: 931,
            },
        },
        {
            index: 216,
            position: {
                x: 2125,
                y: 840,
            },
        },
        {
            index: 337,
            position: {
                x: 1723,
                y: 317,
            },
        },
        {
            index: 25,
            position: {
                x: 1130,
                y: 946,
            },
        },
        {
            index: 44,
            position: {
                x: 816,
                y: 764,
            },
        },
        {
            index: 135,
            position: {
                x: 1091,
                y: 210,
            },
        },
        {
            index: 202,
            position: {
                x: 1846,
                y: 910,
            },
        },
        {
            index: 249,
            position: {
                x: 2054,
                y: 295,
            },
        },
        {
            index: 255,
            position: {
                x: 2049,
                y: 204,
            },
        },
        {
            index: 96,
            position: {
                x: 892,
                y: 680,
            },
        },
        {
            index: 124,
            position: {
                x: 1060,
                y: 417,
            },
        },
        {
            index: 112,
            position: {
                x: 1036,
                y: 706,
            },
        },
        {
            index: 107,
            position: {
                x: 1032,
                y: 785,
            },
        },
        {
            index: 70,
            position: {
                x: 787,
                y: 202,
            },
        },
        {
            index: 76,
            position: {
                x: 829,
                y: 250,
            },
        },
        {
            index: 327,
            position: {
                x: 1740,
                y: 152,
            },
        },
        {
            index: 362,
            position: {
                x: 1693,
                y: 710,
            },
        },
        {
            index: 164,
            position: {
                x: 1268,
                y: 669,
            },
        },
        {
            index: 163,
            position: {
                x: 1256,
                y: 619,
            },
        },
        {
            index: 302,
            position: {
                x: 1949,
                y: 563,
            },
        },
        {
            index: 50,
            position: {
                x: 788,
                y: 617,
            },
        },
        {
            index: 161,
            position: {
                x: 1304,
                y: 602,
            },
        },
        {
            index: 391,
            position: {
                x: 1480,
                y: 160,
            },
        },
        {
            index: 56,
            position: {
                x: 813,
                y: 482,
            },
        },
        {
            index: 19,
            position: {
                x: 1280,
                y: 956,
            },
        },
        {
            index: 199,
            position: {
                x: 1424,
                y: 247,
            },
        },
        {
            index: 208,
            position: {
                x: 1972,
                y: 916,
            },
        },
        {
            index: 3,
            position: {
                x: 1675,
                y: 964,
            },
        },
        {
            index: 157,
            position: {
                x: 1180,
                y: 538,
            },
        },
        {
            index: 394,
            position: {
                x: 1437,
                y: 140,
            },
        },
        {
            index: 127,
            position: {
                x: 1028,
                y: 395,
            },
        },
        {
            index: 132,
            position: {
                x: 1083,
                y: 268,
            },
        },
        {
            index: 141,
            position: {
                x: 1117,
                y: 206,
            },
        },
        {
            index: 397,
            position: {
                x: 1450,
                y: 148,
            },
        },
        {
            index: 80,
            position: {
                x: 884,
                y: 305,
            },
        },
        {
            index: 9,
            position: {
                x: 1526,
                y: 918,
            },
        },
        {
            index: 15,
            position: {
                x: 1359,
                y: 908,
            },
        },
        {
            index: 197,
            position: {
                x: 1389,
                y: 246,
            },
        },
        {
            index: 386,
            position: {
                x: 1508,
                y: 240,
            },
        },
        {
            index: 206,
            position: {
                x: 1922,
                y: 924,
            },
        },
        {
            index: 108,
            position: {
                x: 1021,
                y: 803,
            },
        },
        {
            index: 252,
            position: {
                x: 2068,
                y: 250,
            },
        },
        {
            index: 203,
            position: {
                x: 1868,
                y: 928,
            },
        },
        {
            index: 284,
            position: {
                x: 1998,
                y: 538,
            },
        },
        {
            index: 91,
            position: {
                x: 900,
                y: 524,
            },
        },
        {
            index: 393,
            position: {
                x: 1480,
                y: 158,
            },
        },
        {
            index: 122,
            position: {
                x: 1056,
                y: 470,
            },
        },
        {
            index: 375,
            position: {
                x: 1610,
                y: 441,
            },
        },
        {
            index: 381,
            position: {
                x: 1589,
                y: 344,
            },
        },
        {
            index: 20,
            position: {
                x: 1249,
                y: 956,
            },
        },
        {
            index: 82,
            position: {
                x: 859,
                y: 338,
            },
        },
        {
            index: 241,
            position: {
                x: 2104,
                y: 444,
            },
        },
        {
            index: 136,
            position: {
                x: 1058,
                y: 184,
            },
        },
        {
            index: 368,
            position: {
                x: 1650,
                y: 590,
            },
        },
        {
            index: 234,
            position: {
                x: 2162,
                y: 589,
            },
        },
        {
            index: 328,
            position: {
                x: 1743,
                y: 168,
            },
        },
        {
            index: 369,
            position: {
                x: 1612,
                y: 565,
            },
        },
        {
            index: 200,
            position: {
                x: 1785,
                y: 947,
            },
        },
        {
            index: 395,
            position: {
                x: 1450,
                y: 174,
            },
        },
        {
            index: 37,
            position: {
                x: 778,
                y: 941,
            },
        },
        {
            index: 74,
            position: {
                x: 892,
                y: 162,
            },
        },
        {
            index: 174,
            position: {
                x: 1377,
                y: 734,
            },
        },
        {
            index: 43,
            position: {
                x: 805,
                y: 781,
            },
        },
        {
            index: 376,
            position: {
                x: 1600,
                y: 430,
            },
        },
        {
            index: 158,
            position: {
                x: 1224,
                y: 540,
            },
        },
        {
            index: 324,
            position: {
                x: 1774,
                y: 141,
            },
        },
        {
            index: 98,
            position: {
                x: 926,
                y: 652,
            },
        },
        {
            index: 277,
            position: {
                x: 2014,
                y: 413,
            },
        },
        {
            index: 185,
            position: {
                x: 1372,
                y: 486,
            },
        },
        {
            index: 233,
            position: {
                x: 2148,
                y: 602,
            },
        },
        {
            index: 167,
            position: {
                x: 1265,
                y: 748,
            },
        },
        {
            index: 110,
            position: {
                x: 992,
                y: 752,
            },
        },
        {
            index: 133,
            position: {
                x: 1068,
                y: 210,
            },
        },
        {
            index: 59,
            position: {
                x: 815,
                y: 413,
            },
        },
        {
            index: 323,
            position: {
                x: 1758,
                y: 164,
            },
        },
        {
            index: 274,
            position: {
                x: 2006,
                y: 345,
            },
        },
        {
            index: 316,
            position: {
                x: 1832,
                y: 276,
            },
        },
        {
            index: 11,
            position: {
                x: 1478,
                y: 922,
            },
        },
        {
            index: 367,
            position: {
                x: 1678,
                y: 611,
            },
        },
        {
            index: 247,
            position: {
                x: 2069,
                y: 339,
            },
        },
        {
            index: 81,
            position: {
                x: 885,
                y: 320,
            },
        },
        {
            index: 319,
            position: {
                x: 1808,
                y: 218,
            },
        },
        {
            index: 149,
            position: {
                x: 1168,
                y: 356,
            },
        },
        {
            index: 116,
            position: {
                x: 1032,
                y: 594,
            },
        },
        {
            index: 92,
            position: {
                x: 983,
                y: 526,
            },
        },
        {
            index: 387,
            position: {
                x: 1526,
                y: 213,
            },
        },
        {
            index: 379,
            position: {
                x: 1556,
                y: 348,
            },
        },
        {
            index: 187,
            position: {
                x: 1416,
                y: 446,
            },
        },
        {
            index: 35,
            position: {
                x: 832,
                y: 977,
            },
        },
        {
            index: 178,
            position: {
                x: 1351,
                y: 639,
            },
        },
        {
            index: 309,
            position: {
                x: 1902,
                y: 449,
            },
        },
        {
            index: 313,
            position: {
                x: 1846,
                y: 347,
            },
        },
        {
            index: 220,
            position: {
                x: 2198,
                y: 862,
            },
        },
        {
            index: 170,
            position: {
                x: 1404,
                y: 600,
            },
        },
        {
            index: 171,
            position: {
                x: 1348,
                y: 808,
            },
        },
        {
            index: 87,
            position: {
                x: 870,
                y: 444,
            },
        },
        {
            index: 192,
            position: {
                x: 1363,
                y: 367,
            },
        },
        {
            index: 339,
            position: {
                x: 1728,
                y: 360,
            },
        },
        {
            index: 186,
            position: {
                x: 1406,
                y: 467,
            },
        },
        {
            index: 131,
            position: {
                x: 1016,
                y: 327,
            },
        },
        {
            index: 257,
            position: {
                x: 2038,
                y: 176,
            },
        },
        {
            index: 268,
            position: {
                x: 2003,
                y: 242,
            },
        },
        {
            index: 143,
            position: {
                x: 1146,
                y: 284,
            },
        },
        {
            index: 292,
            position: {
                x: 2012,
                y: 704,
            },
        },
        {
            index: 355,
            position: {
                x: 1717,
                y: 693,
            },
        },
        {
            index: 364,
            position: {
                x: 1650,
                y: 685,
            },
        },
        {
            index: 341,
            position: {
                x: 1728,
                y: 400,
            },
        },
        {
            index: 343,
            position: {
                x: 1720,
                y: 435,
            },
        },
        {
            index: 62,
            position: {
                x: 820,
                y: 338,
            },
        },
        {
            index: 310,
            position: {
                x: 1882,
                y: 394,
            },
        },
        {
            index: 221,
            position: {
                x: 2219,
                y: 857,
            },
        },
        {
            index: 253,
            position: {
                x: 2030,
                y: 240,
            },
        },
        {
            index: 106,
            position: {
                x: 1010,
                y: 868,
            },
        },
        {
            index: 113,
            position: {
                x: 1006,
                y: 680,
            },
        },
        {
            index: 94,
            position: {
                x: 872,
                y: 550,
            },
        },
        {
            index: 361,
            position: {
                x: 1667,
                y: 740,
            },
        },
        {
            index: 251,
            position: {
                x: 2067,
                y: 259,
            },
        },
        {
            index: 129,
            position: {
                x: 1021,
                y: 360,
            },
        },
        {
            index: 69,
            position: {
                x: 818,
                y: 218,
            },
        },
        {
            index: 399,
            position: {
                x: 1424,
                y: 232,
            },
        },
        {
            index: 51,
            position: {
                x: 750,
                y: 594,
            },
        },
        {
            index: 271,
            position: {
                x: 1973,
                y: 291,
            },
        },
        {
            index: 198,
            position: {
                x: 1396,
                y: 220,
            },
        },
        {
            index: 265,
            position: {
                x: 1996,
                y: 192,
            },
        },
        {
            index: 18,
            position: {
                x: 1296,
                y: 950,
            },
        },
        {
            index: 223,
            position: {
                x: 2234,
                y: 799,
            },
        },
        {
            index: 100,
            position: {
                x: 948,
                y: 756,
            },
        },
        {
            index: 398,
            position: {
                x: 1430,
                y: 219,
            },
        },
        {
            index: 49,
            position: {
                x: 777,
                y: 643,
            },
        },
        {
            index: 191,
            position: {
                x: 1409,
                y: 413,
            },
        },
        {
            index: 246,
            position: {
                x: 2107,
                y: 352,
            },
        },
        {
            index: 243,
            position: {
                x: 2098,
                y: 399,
            },
        },
        {
            index: 102,
            position: {
                x: 970,
                y: 720,
            },
        },
        {
            index: 180,
            position: {
                x: 1360,
                y: 610,
            },
        },
        {
            index: 68,
            position: {
                x: 792,
                y: 240,
            },
        },
        {
            index: 130,
            position: {
                x: 1120,
                y: 276,
            },
        },
        {
            index: 248,
            position: {
                x: 2058,
                y: 318,
            },
        },
        {
            index: 363,
            position: {
                x: 1664,
                y: 707,
            },
        },
        {
            index: 346,
            position: {
                x: 1732,
                y: 502,
            },
        },
        {
            index: 286,
            position: {
                x: 2029,
                y: 593,
            },
        },
        {
            index: 263,
            position: {
                x: 1993,
                y: 172,
            },
        },
        {
            index: 390,
            position: {
                x: 1572,
                y: 190,
            },
        },
        {
            index: 260,
            position: {
                x: 1999,
                y: 131,
            },
        },
        {
            index: 105,
            position: {
                x: 976,
                y: 834,
            },
        },
        {
            index: 278,
            position: {
                x: 2014,
                y: 424,
            },
        },
        {
            index: 335,
            position: {
                x: 1719,
                y: 283,
            },
        },
        {
            index: 213,
            position: {
                x: 2072,
                y: 882,
            },
        },
        {
            index: 31,
            position: {
                x: 958,
                y: 990,
            },
        },
        {
            index: 146,
            position: {
                x: 1130,
                y: 311,
            },
        },
        {
            index: 156,
            position: {
                x: 1168,
                y: 507,
            },
        },
        {
            index: 4,
            position: {
                x: 1684,
                y: 921,
            },
        },
        {
            index: 211,
            position: {
                x: 2029,
                y: 892,
            },
        },
    ],
    unknownIndexes: [],
};
exports.staticLedStatus = { leds: exports.staticLedMappingResult.foundLeds };


/***/ }),

/***/ "./packages/nice-common/src/domainContracts.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./packages/nice-common/src/effects/effectContracts.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./packages/nice-common/src/effects/effectsCollection.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EffectsCollection = void 0;
const tslib_1 = __webpack_require__("tslib");
const _ = tslib_1.__importStar(__webpack_require__("lodash"));
class EffectsCollection {
    constructor() {
        this.effects = [];
    }
    add(effect) {
        this.effects.push(effect);
    }
    tick(milliseconds, inputFrame, props) {
        if (this.effects.length === 0) {
            return { frame: inputFrame, affectedLedIndexes: [] };
        }
        const effectOutputs = [];
        const completedEffects = [];
        for (const effect of this.effects) {
            const output = effect.tick(milliseconds, props);
            effectOutputs.push(output);
            if (effect.isFinished) {
                completedEffects.push(effect);
            }
        }
        // Remove finished effects.
        _.remove(this.effects, (e) => completedEffects.includes(e));
        // Merge combined result of all effects.
        const outputFrame = { ...inputFrame };
        for (const effectOutput of effectOutputs) {
            for (const ledIndexAsString of Object.keys(effectOutput)) {
                const ledIndex = Number.parseInt(ledIndexAsString);
                if (ledIndex in outputFrame) {
                    // Additive blend effect and frame.
                    outputFrame[ledIndex].r = clamp(outputFrame[ledIndex].r + effectOutput[ledIndex].r);
                    outputFrame[ledIndex].g = clamp(outputFrame[ledIndex].g + effectOutput[ledIndex].g);
                    outputFrame[ledIndex].b = clamp(outputFrame[ledIndex].b + effectOutput[ledIndex].b);
                }
                else {
                    // Dark led. Just add effect.
                    outputFrame[ledIndex] = {
                        r: clamp(effectOutput[ledIndex].r),
                        g: clamp(effectOutput[ledIndex].g),
                        b: clamp(effectOutput[ledIndex].b),
                    };
                }
            }
        }
        // TODO - A bit nasty.
        //  We're just returning all the led indexes affected by applied effects.
        return {
            frame: outputFrame,
            affectedLedIndexes: _.uniq(_.flatMap(effectOutputs, (e) => Object.keys(e).map((index) => Number.parseInt(index)))),
        };
    }
}
exports.EffectsCollection = EffectsCollection;
function clamp(color) {
    return Math.min(255, color);
}


/***/ }),

/***/ "./packages/nice-common/src/effects/highlightObjectEffect.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HighlightObjectEffect = void 0;
const tslib_1 = __webpack_require__("tslib");
const _ = tslib_1.__importStar(__webpack_require__("lodash"));
const ledOcclusion_1 = __webpack_require__("./packages/nice-common/src/utils/ledOcclusion.ts");
// A very basic glow effect.
// The glow is dispersed out from the object in the cable dimension,
// lighting up x leds in both directions on the cable.
class HighlightObjectEffect {
    constructor(object, wantedEffectLengthInMs = 2000) {
        this.object = object;
        this.wantedEffectLengthInMs = wantedEffectLengthInMs;
        this.isFinished = false;
        this.spentEffectLength = 0;
    }
    tick(ellapsedMilliseconds, props) {
        if (this.isFinished) {
            return {};
        }
        const leds = (0, ledOcclusion_1.findOccludedLeds)(props.ledInfo.leds, this.object.rectangle).map((l) => l.index);
        if (leds.length === 0) {
            return {};
        }
        // Find the "glow" positions.
        // This is currently just the next few leds out from the object.
        // TODO - Basing on index for now (position on the wire). Since we have the position info, we could use distance.
        const min = _.min(leds);
        const max = _.max(leds);
        const ledCountToGoInEitherDirection = 5;
        const lowerLeds = _.range(Math.max(0, min - ledCountToGoInEitherDirection), min);
        const higherLeds = _.range(max + 1, Math.min(props.ledInfo.leds.length - 1, max + ledCountToGoInEitherDirection + 1));
        // Increase red-ness given effect time remaining.
        // TODO - Could be cool to use a ramping function here. Currently just linear.
        const remainingEffectAsFraction = 1 - this.spentEffectLength / this.wantedEffectLengthInMs;
        const redness = Math.round(255 * remainingEffectAsFraction);
        this.spentEffectLength += ellapsedMilliseconds;
        if (this.spentEffectLength >= this.wantedEffectLengthInMs) {
            this.isFinished = true;
        }
        return _.fromPairs(lowerLeds
            .concat(higherLeds)
            .map((led) => [led, { r: redness, g: 0, b: 0 }]));
    }
}
exports.HighlightObjectEffect = HighlightObjectEffect;


/***/ }),

/***/ "./packages/nice-common/src/effects/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/nice-common/src/effects/effectContracts.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/nice-common/src/effects/effectsCollection.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/nice-common/src/effects/highlightObjectEffect.ts"), exports);


/***/ }),

/***/ "./packages/nice-common/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/nice-common/src/domainContracts.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/nice-common/src/messageContracts.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/nice-common/src/lights/lightContracts.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/nice-common/src/data/leds.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/nice-common/src/utils/ledOcclusion.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/nice-common/src/utils/generalUtils.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./packages/nice-common/src/action/actionDirector.ts"), exports);
// TODO - Export as sub module, so usage is `import * from "nice/effects"`;
tslib_1.__exportStar(__webpack_require__("./packages/nice-common/src/effects/index.ts"), exports);


/***/ }),

/***/ "./packages/nice-common/src/lights/lightContracts.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./packages/nice-common/src/messageContracts.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./packages/nice-common/src/utils/generalUtils.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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


/***/ }),

/***/ "./packages/nice-common/src/utils/ledOcclusion.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pointInPolygon = exports.isOccluded = exports.findOccludedLeds = void 0;
function findOccludedLeds(leds, rectangle) {
    return leds.filter(led => isOccluded(led.position, rectangle));
}
exports.findOccludedLeds = findOccludedLeds;
;
function isOccluded(point, placedObject) {
    // Note: the rectangle can be rotated.
    // TODO - If the rectangle is uniform(name? parallel sides), it could be quicker to
    // revert the rotation for both the rectangle and the point, and then do a simple check.
    return pointInPolygon(point, [placedObject.topLeft, placedObject.topRight, placedObject.bottomRight, placedObject.bottomLeft]);
}
exports.isOccluded = isOccluded;
function pointInPolygon(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    const { x, y } = point;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i].x, yi = vs[i].y;
        const xj = vs[j].x, yj = vs[j].y;
        const intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect)
            inside = !inside;
    }
    return inside;
}
exports.pointInPolygon = pointInPolygon;
;


/***/ }),

/***/ "./packages/nice-shared-node/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./packages/nice-shared-node/src/lightsApiClient.ts"), exports);


/***/ }),

/***/ "./packages/nice-shared-node/src/lightsApiClient.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LightsApiClient = void 0;
const tslib_1 = __webpack_require__("tslib");
const _ = tslib_1.__importStar(__webpack_require__("lodash"));
const nice_common_1 = __webpack_require__("./packages/nice-common/src/index.ts");
const node_fetch_1 = tslib_1.__importDefault(__webpack_require__("node-fetch"));
class LightsApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async getLedInfo() {
        const response = await (0, node_fetch_1.default)(`${this.baseUrl}/lights/info/`);
        const ledData = (await response.json());
        return ledData;
    }
    async turnOnLight(index, color) {
        const params = new URLSearchParams({
            index: index.toString(),
            color: color.toString(),
        });
        await (0, node_fetch_1.default)(`${this.baseUrl}/lights/single/?${params}`);
        await (0, nice_common_1.delay)(100);
    }
    async turnOnLights(colorsByIndex) {
        await (0, node_fetch_1.default)(`${this.baseUrl}/lights/multi/`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(colorsByIndex),
        });
        await (0, nice_common_1.delay)(20);
    }
    async turnOnLightRgb(indexes) {
        const indexesAsString = _.mapValues(indexes, (i) => i?.toString());
        const params = new URLSearchParams(indexesAsString); // TODO - Don't cast.
        await (0, node_fetch_1.default)(`${this.baseUrl}/lights/rgb/?${params}`);
        await (0, nice_common_1.delay)(300);
    }
    async reset() {
        await (0, node_fetch_1.default)(`${this.baseUrl}/lights/reset/`);
        await (0, nice_common_1.delay)(500);
    }
}
exports.LightsApiClient = LightsApiClient;


/***/ }),

/***/ "color":
/***/ ((module) => {

module.exports = require("color");

/***/ }),

/***/ "lodash":
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ "node-fetch":
/***/ ((module) => {

module.exports = require("node-fetch");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),

/***/ "ws":
/***/ ((module) => {

module.exports = require("ws");

/***/ }),

/***/ "perf_hooks":
/***/ ((module) => {

module.exports = require("perf_hooks");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const nice_common_1 = __webpack_require__("./packages/nice-common/src/index.ts");
const nice_shared_node_1 = __webpack_require__("./packages/nice-shared-node/src/index.ts");
const perf_hooks_1 = __webpack_require__("perf_hooks");
const WebSocket = tslib_1.__importStar(__webpack_require__("ws"));
async function run() {
    try {
        const wss = new WebSocket.Server({ port: 8080 });
        const lights = new nice_shared_node_1.LightsApiClient("http://localhost:8001");
        const director = new nice_common_1.ActionDirector({ leds: nice_common_1.staticLedMappingResult.foundLeds }, lights, () => perf_hooks_1.performance.now());
        const actionHandler = (0, nice_common_1.getActionDirectorMessageHandler)(director);
        wss.on("connection", function connection(ws) {
            ws.on("message", function incoming(message) {
                const action = tryParse(message.toString());
                if (action) {
                    actionHandler(action);
                }
                else {
                    console.log("Received non-action: %s", message);
                }
            });
            ws.send("something");
        });
        console.log("Started on: " + JSON.stringify(wss.address(), null, 2));
    }
    catch (error) {
        console.error(error);
    }
}
run();
function tryParse(message) {
    try {
        const action = JSON.parse(message);
        return action;
    }
    catch (error) {
        return undefined;
    }
}

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map