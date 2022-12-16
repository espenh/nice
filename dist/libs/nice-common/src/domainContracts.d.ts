export interface IPlacedObject {
    id: string;
    rectangle: IRectangle;
    color: string;
}
export interface IMovingObject {
    coordinate: ICoordinate;
}
export interface IRectangle {
    topLeft: ICoordinate;
    topRight: ICoordinate;
    bottomLeft: ICoordinate;
    bottomRight: ICoordinate;
}
export declare type ICoordinate = {
    x: number;
    y: number;
};
export interface ILedStatus {
    leds: ILedPos[];
}
export interface ILedPos {
    index: number;
    position: ICoordinate;
}
export declare type ColorsByIndex = {
    [index: number]: {
        r: number;
        g: number;
        b: number;
    };
};
export interface ILedInfo {
    product_name: string;
    hardware_version: string;
    bytes_per_led: number;
    hw_id: string;
    flash_size: number;
    led_type: number;
    product_code: string;
    fw_family: string;
    device_name: string;
    uptime: number;
    mac: string;
    uuid: string;
    max_supported_led: number;
    number_of_led: number;
    led_profile: string;
    frame_rate: number;
    measured_frame_rate: number;
    movie_capacity: number;
    wire_type: number;
    copyright: string;
    code: number;
}
