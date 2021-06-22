"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const _ = __importStar(require("lodash"));
const luxon_1 = require("luxon");
const cameraApiClient_1 = require("./cameraApiClient");
const lightsApiClient_1 = require("./lightsApiClient");
const utils_1 = require("./utils");
const chalk = __importStar(require("chalk"));
console.log("nice-mapper started");
async function runTest() {
    const lights = new lightsApiClient_1.LightsApiClient("http://localhost:8001");
    const camera = new cameraApiClient_1.CameraApiClient("http://localhost:8000");
    await lights.reset();
    await camera.setBaseline();
    utils_1.jsonLog("Capturing before");
    utils_1.jsonLog(await camera.captureRgb());
    console.log("Turning on");
    await lights.turnOnLightRgb({ redIndex: 200, greenIndex: 202, blueIndex: 204 });
    utils_1.jsonLog("Capturing after");
    utils_1.jsonLog(await camera.captureRgb());
}
async function runMapping() {
    const lights = new lightsApiClient_1.LightsApiClient("http://localhost:8001");
    const camera = new cameraApiClient_1.CameraApiClient("http://localhost:8000");
    const { number_of_led: ledCount } = await lights.getLedInfo();
    // Basic 2d mapping algorithm.
    // 1: Turn on 3 leds. One red, one green and one blue.
    // 2: Take snapshot from camera with 2d position of red, green and blue.
    // 3: Keep iterating over the leds until all leds have been mapped.
    // The leds are ordered by the position on the wire, 
    // so index 0 is the first led, followed by index 1 etc.
    // To make the mapping easier we should turn on leds that are 
    // likely to have some distance between them. This is to make the
    // color mapping easier (green light not interferring with the blue etc.).
    // For now just shuffle the indexes. A future improvement would be to pick indexes 
    // in a way that keeps distance between all three lights.
    const foundLeds = [];
    const unknownIndexes = [];
    const ledIndexesInRgbGroups = _.chunk(_.shuffle(_.range(0, ledCount)), 3);
    // Turn off all lights and capture a frame that's used to remove background in the mapping process.
    await lights.reset();
    await camera.setBaseline();
    const baseLineResponse = await camera.getBaseline();
    while (ledIndexesInRgbGroups.length > 0) {
        const rgbIndexGroup = ledIndexesInRgbGroups.pop();
        const [redIndex, greenIndex, blueIndex] = rgbIndexGroup;
        await lights.turnOnLightRgb({ redIndex, greenIndex, blueIndex });
        const capturedRgb = await camera.captureRgb();
        if (capturedRgb.result === "fail") {
            console.warn(`Failed capture, indexes: ${rgbIndexGroup.join(",")}`);
            unknownIndexes.push(...rgbIndexGroup);
            // TODO: Try again in a different ordering?
        }
        else {
            const checks = [
                {
                    index: redIndex,
                    capture: capturedRgb.red,
                    outputColor: chalk.red
                },
                {
                    index: greenIndex,
                    capture: capturedRgb.green,
                    outputColor: chalk.green
                },
                {
                    index: blueIndex,
                    capture: capturedRgb.blue,
                    outputColor: chalk.blue
                }
            ];
            checks.forEach(check => {
                if (check.capture) {
                    foundLeds.push({
                        index: check.index,
                        position: check.capture
                    });
                    console.log(`Found led at: (${check.outputColor(check.capture.x)},${check.outputColor(check.capture.y)})`);
                }
                else {
                    unknownIndexes.push(check.index);
                }
            });
        }
    }
    return { baseLine: baseLineResponse.baseline, result: { foundLeds, unknownIndexes } };
}
async function run() {
    try {
        const mapping = await runMapping();
        const timestamp = luxon_1.DateTime.utc().toFormat("yyyy-MM-dd_HHmmss");
        fs.writeFileSync(`${`./mapping_` + timestamp}_baseline.jpg`, mapping.baseLine, { encoding: 'base64' });
        fs.writeFileSync(`${`./mapping_` + timestamp}_result.json`, JSON.stringify(mapping.result, null, 2));
    }
    catch (error) {
        console.error(error);
    }
}
run();
