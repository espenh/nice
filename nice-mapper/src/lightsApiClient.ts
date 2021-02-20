import * as _ from "lodash";
import fetch from "node-fetch";
import { delay } from "./utils";

export class LightsApiClient {
    constructor(private readonly baseUrl: string) {
    }

    async getLedInfo() {
        const response = await fetch(`${this.baseUrl}/lights/info/`);
        const ledData: ILedInfo = await response.json();
        return ledData;
    }

    async turnOnLight(index: number, color: number) {
        const params = new URLSearchParams({ index: index.toString(), color: color.toString() });
        await fetch(`${this.baseUrl}/lights/single/?${params}`);
        await delay(100);
    }

    async turnOnLights(colorsByIndex: ColorsByIndex) {
        await fetch(`${this.baseUrl}/lights/multi/`, {
            method: "post", headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(colorsByIndex)
        });
        await delay(20);
    }

    async turnOnLightRgb(indexes: { redIndex?: number | undefined, greenIndex?: number | undefined, blueIndex?: number | undefined }) {
        const indexesAsString = _.mapValues(indexes, i => i?.toString());
        const params = new URLSearchParams(indexesAsString as any); // TODO - Don't cast.
        await fetch(`${this.baseUrl}/lights/rgb/?${params}`);
        await delay(300);
    }

    async reset() {
        await fetch(`${this.baseUrl}/lights/reset/`);
        await delay(500);
    }
}

export type ColorsByIndex = { [index: number]: { r: number, g: number, b: number } };

// Copied from the output of /gestalt on the Twinkly api.
export interface ILedInfo {
    product_name: string,
    hardware_version: string,
    bytes_per_led: number,
    hw_id: string,
    flash_size: number,
    led_type: number,
    product_code: string,
    fw_family: string,
    device_name: string,
    uptime: number,
    mac: string,
    uuid: string,
    max_supported_led: number,
    number_of_led: number,
    led_profile: string,
    frame_rate: number,
    measured_frame_rate: number,
    movie_capacity: number,
    wire_type: number,
    copyright: string,
    code: number
}