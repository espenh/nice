//The below code (and all of DrawingEditor) was originally developed
//by my teammate Christopher Jestice (https://www.linkedin.com/in/christopher-jestice)
//Refinements are by me, Matthew Jones (https://exceptionnotfound.net).

import fabric from "fabric/fabric-impl";
import { DisplayComponent } from "./displayComponent";
import { CursorMode, DrawingMode, IObjectDrawer } from "./drawContracts";
import { LineDisplayComponent } from "./lineDisplayComponent";
import { LineDrawer } from "./lineDrawer";

export class DrawingEditor {
  private components: DisplayComponent[];

  private cursorMode: CursorMode;
  private _drawer: IObjectDrawer;
  readonly drawerOptions: fabric.IObjectOptions;
  private readonly drawers: IObjectDrawer[];
  private isDown: boolean;
  private isObjectSelected: boolean = false;
  private object: fabric.Object;

  constructor(private readonly canvas: fabric.Canvas) {
    this.cursorMode = CursorMode.Draw;

    this.components = [];

    this.drawers = [new LineDrawer()];
    this._drawer = this.drawers[DrawingMode.Line];
    this.drawerOptions = {
      stroke: "black",
      strokeWidth: 1,
      selectable: true,
      strokeUniform: true,
    };

    this.isDown = false;
    this.initializeCanvasEvents();
  }

  //Properties
  get drawingMode() {
    return this._drawer.drawingMode;
  }

  set drawingMode(value: DrawingMode) {
    this._drawer = this.drawers[value];
  }

  private initializeCanvasEvents() {
    this.canvas.on("mouse:down", (o) => {
      const pointer = this.canvas.getPointer(o.e);
      this.mouseDown(pointer.x, pointer.y);
      this.isObjectSelected = this.canvas.getActiveObject() !== null;
    });

    this.canvas.on("mouse:move", (o) => {
      const pointer = this.canvas.getPointer(o.e);
      this.mouseMove(pointer.x, pointer.y);
    });

    this.canvas.on("mouse:over", (o) => {
      if (this.isDown || this.isObjectSelected || o.target === null) {
        return;
      }

      if (o.target != null && o.target.selectable) {
        this.canvas.setActiveObject(o.target);
        this.canvas.renderAll();
      }
    });

    this.canvas.on("mouse:out", (o) => {
      if (this.isObjectSelected) {
        return;
      }

      this.canvas.discardActiveObject().renderAll();
    });

    this.canvas.on("mouse:up", (o) => {
      this.isDown = false;
      switch (this.cursorMode) {
        case CursorMode.Draw:
          this.isObjectSelected = false;
      }
    });

    //this.canvas.on("object:selected", (o) => {
    this.canvas.on("selection:created", (o) => {
      console.log("Select mode");
      this.cursorMode = CursorMode.Select;
      //sets currently selected object
      this.object = o.target;
    });

    this.canvas.on("selection:cleared", (o) => {
      this.cursorMode = CursorMode.Draw;
    });

    this.canvas.on("object:modified", (e) => {});
  }

  private async make(x: number, y: number): Promise<fabric.Object> {
    return await this._drawer.make(x, y, this.drawerOptions);
  }

  private mouseMove(x: number, y: number): any {
    if (!(this.cursorMode === CursorMode.Draw && this.isDown)) {
      return;
    }
    this._drawer.resize(this.object, x, y);
    this.canvas.renderAll();
  }

  private async mouseDown(x: number, y: number): Promise<any> {
    this.isDown = true;

    if (this.cursorMode !== CursorMode.Draw) {
      return;
    }

    this.object = await this.make(x, y);
    this.canvas.add(this.object);
    this.canvas.renderAll();
  }

  addComponents(componentList: [{ id: string; type: string }]) {
    componentList.forEach((item) => {
      this.addComponent(item.id, item.type);
    });
  }

  addComponent(target: string, component: string) {
    switch (component) {
      case "line":
        this.components[component] = [new LineDisplayComponent(target, this)];
        break;
    }
  }

  componentSelected(componentName: string) {
    this.canvas.discardActiveObject();
    for (var key in this.components) {
      if (!this.components.hasOwnProperty(key)) continue;

      const obj = this.components[key];

      if (obj[0].target === componentName) {
        this.drawingMode = obj[0].drawingMode;
      }

      //Not all types have a selectedChanged event
      if (obj[0].selectedChanged !== undefined)
        obj[0].selectedChanged(componentName);
    }
  }

  deleteSelected(): void {
    this.canvas.remove(this.canvas.getActiveObject());
    this.canvas.renderAll();
  }

  setFillColor(color: string): void {
    this.drawerOptions.fill = color;
  }

  setLineColor(color: string): void {
    this.drawerOptions.stroke = color;
  }

  setStrokeWidth(strokeWidth: number): void {
    this.drawerOptions.strokeWidth = strokeWidth;
  }
}
