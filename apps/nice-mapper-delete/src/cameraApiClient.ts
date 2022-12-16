import fetch from "node-fetch"

export class CameraApiClient {
    constructor(private readonly baseUrl: string) { }

    public async captureRgb() {
        const jsonResponse = await fetch(`${this.baseUrl}/capture/rgb/`);
        const rgbData = await jsonResponse.json() as CaptureRgbResponse;
        return rgbData;
    }

    public async setBaseline() {
        await fetch(`${this.baseUrl}/capture/baseline/`);
    }

    public async getBaseline() {
        const response = await fetch(`${this.baseUrl}/capture/baseline/get/`);
        const baseLine = await response.json() as IBaselineResponse;
        return baseLine;
    }
}

export type CaptureRgbResponse = CaptureRgbResponseSuccess | CaptureRgbResponseFail;

export interface CaptureRgbResponseSuccess {
    result: "success";
    red: I2DColorPosition | null;
    green: I2DColorPosition | null;
    blue: I2DColorPosition | null;
}

export interface I2DColorPosition {
    x: number;
    y: number;
}

export interface CaptureRgbResponseFail {
    result: "fail";
}


export interface IBaselineResponse {
    baseline: string;
}