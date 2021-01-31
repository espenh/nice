import fetch from "node-fetch"

export class CameraApiClient {
    constructor(private readonly baseUrl: string) { }

    public async captureRgb() {
        const jsonResponse = await fetch(`${this.baseUrl}/capture/rgb/`);
        const rgbData = await jsonResponse.json() as CaptureRgbResponse;
        return rgbData;
    }

    public async setBaseline(){
        await fetch(`${this.baseUrl}/capture/baseline/`);
    }
}

export type CaptureRgbResponse = CaptureRgbResponseSuccess | CaptureRgbResponseFail;

export interface CaptureRgbResponseSuccess {
    result: "success";
    red: {
        x: number,
        y: number
    };
}

export interface CaptureRgbResponseFail {
    result: "fail";
}
