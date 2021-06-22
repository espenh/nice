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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightsApiClient = void 0;
const _ = __importStar(require("lodash"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const utils_1 = require("./utils");
class LightsApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async getLedInfo() {
        const response = await node_fetch_1.default(`${this.baseUrl}/lights/info/`);
        const ledData = await response.json();
        return ledData;
    }
    async turnOnLight(index, color) {
        const params = new URLSearchParams({ index: index.toString(), color: color.toString() });
        await node_fetch_1.default(`${this.baseUrl}/lights/single/?${params}`);
        await utils_1.delay(100);
    }
    async turnOnLights(colorsByIndex) {
        await node_fetch_1.default(`${this.baseUrl}/lights/multi/`, {
            method: "post", headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(colorsByIndex)
        });
        await utils_1.delay(20);
    }
    async turnOnLightRgb(indexes) {
        const indexesAsString = _.mapValues(indexes, i => i === null || i === void 0 ? void 0 : i.toString());
        const params = new URLSearchParams(indexesAsString); // TODO - Don't cast.
        await node_fetch_1.default(`${this.baseUrl}/lights/rgb/?${params}`);
        await utils_1.delay(300);
    }
    async reset() {
        await node_fetch_1.default(`${this.baseUrl}/lights/reset/`);
        await utils_1.delay(500);
    }
}
exports.LightsApiClient = LightsApiClient;
