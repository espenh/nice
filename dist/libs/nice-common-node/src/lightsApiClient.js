"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightsApiClient = void 0;
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const nice_common_1 = require("@nice/nice-common");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
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
//# sourceMappingURL=lightsApiClient.js.map