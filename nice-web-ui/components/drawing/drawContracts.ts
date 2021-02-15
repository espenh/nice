export interface IObjectDrawer {
    drawingMode: DrawingMode;
    readonly make: (x: number, //Horizontal starting point
        y: number, //Vertical starting point
        options: fabric.IObjectOptions,
        x2?: number, //Horizontal ending point
        y2?: number) //Vertical ending point
            => Promise<fabric.Object>;
    readonly resize: (object: fabric.Object, x: number, y: number) => Promise<fabric.Object>;
}

export enum CursorMode {
    Draw,
    Select
}

export enum DrawingMode {
    Line,
    Rectangle,
    Oval,
    Triangle,
    Text,
    Polyline,
    Path
}