import { ColorsByIndex, ILedInfo, ILightsClient } from "@nice/nice-common";
export declare class LightsApiClient implements ILightsClient {
    private readonly baseUrl;
    constructor(baseUrl: string);
    getLedInfo(): Promise<ILedInfo>;
    turnOnLight(index: number, color: number): Promise<void>;
    turnOnLights(colorsByIndex: ColorsByIndex): Promise<void>;
    turnOnLightRgb(indexes: {
        redIndex?: number | undefined;
        greenIndex?: number | undefined;
        blueIndex?: number | undefined;
    }): Promise<void>;
    reset(): Promise<void>;
}
