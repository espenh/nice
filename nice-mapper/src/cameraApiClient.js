"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraApiClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class CameraApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async captureRgb() {
        const jsonResponse = await node_fetch_1.default(`${this.baseUrl}/capture/rgb/`);
        const rgbData = await jsonResponse.json();
        return rgbData;
    }
    async setBaseline() {
        await node_fetch_1.default(`${this.baseUrl}/capture/baseline/`);
    }
    async getBaseline() {
        const response = await node_fetch_1.default(`${this.baseUrl}/capture/baseline/get/`);
        const baseLine = await response.json();
        return baseLine;
    }
}
exports.CameraApiClient = CameraApiClient;
