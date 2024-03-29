
import { fabric } from "fabric";
import { ICoordinate } from "@nice/nice-common";
import React, { useContext, useEffect } from "react";
import { v4 } from "uuid";
import { FabricContext } from "../contexts/fabricContext";

import { FabricCanvas } from "./fabricCanvas";
import { DrawMode } from "../models/drawContracts";

export interface IEditorSurfaceProps {
  leds: ILedPos[];
  mode: DrawMode;
}

interface ILedPos {
  index: number;
  position: ICoordinate;
}

export const EditorSurface: React.FunctionComponent<IEditorSurfaceProps> = (
  props
) => {
  const { canvas } = useContext(FabricContext);
  const { mode } = props;

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const stateBag: any = {};
    wireUpEvents(canvas, stateBag, mode);
  }, [canvas, mode]);

  React.useEffect(() => {
    if (!canvas) {
      return;
    }

    canvas.setBackgroundImage("/editor/ice_baseline.jpg", () => {
      canvas.renderAll();
    });

    const ledDots = props.leds.flatMap((led) => {
      const dot = new fabric.Circle({
        left: led.position.x,
        top: led.position.y,
        fill: "#4800FF",
        opacity: 0.5,
        radius: 5,
        strokeWidth: 1,
        stroke: "black",
        selectable: false,
        originX: "center",
        originY: "center",
        width: 5,
        data: {
          type: "led",
        },
      });

      const text = new fabric.Text(led.index.toString(), {
        left: led.position.x,
        top: led.position.y,
        selectable: false,
        fontSize: 10,
      });

      return [text, dot];
    });

    canvas.add(...ledDots);

    //canvas.on("after:render", (e) => {
    const line = createLine(1120, 273.37, 65);
    line.angle = 68.6;
    line.width = 460;
    canvas.add(line);
    //canvas.renderAll();
    canvas.setActiveObject(line);
    canvas.zoomToPoint({ x: -330, y: -10 } as any, 1 - 0.68);
    //});

    canvas.on("mouse:down", (e) => {
      if (e.target?.data?.type === "led") {
        // We can use this to snap-to-line
      }

      console.log({ center: canvas.getCenter(), zoom: canvas.getZoom() });
    });

    return () => {
      canvas.dispose();
    };
  }, [canvas]);

  return <FabricCanvas />;
};

function createLine(x: number, y: number, height: number) {
  const halfHeight = height / 2;

  const line = new fabric.Rect({
    left: x,
    top: y + halfHeight,
    height: height,
    width: 1,
    fill: "#0094FF",
    data: { id: v4() },
    strokeWidth: 0,
    opacity: 0.7,
    //originX: "center",
    originY: "center",
  });

  return line;
}

function wireUpEvents(
  canvas: fabric.Canvas,
  stateBag: any,
  editMode: DrawMode
) {
  // TODO: All of this event stuff + "stateBag" needs to go.
  canvas.off("mouse:down");
  canvas.off("mouse:move");
  canvas.off("mouse:up");
  canvas.off("mouse:wheel");

  canvas.on("mouse:down", function (opt) {
    const evt = opt.e as MouseEvent;

    if (editMode === DrawMode.Drawing) {
      stateBag.isDown = true;
      const pointer = canvas.getPointer(evt);
      const height = 60;

      const line = createLine(pointer.x, pointer.y, height);
      canvas.add(line);

      stateBag.line = line;
      stateBag.startPoint = new fabric.Point(pointer.x, pointer.y);
    } else {
      if (evt.altKey === true) {
        stateBag.isDragging = true;
        canvas.selection = false;
        stateBag.lastPosX = evt.clientX;
        stateBag.lastPosY = evt.clientY;
      }
    }
  });

  canvas.on("mouse:move", function (opt) {
    if (editMode === DrawMode.Drawing && stateBag.isDown) {
      const pointer = canvas.getPointer(opt.e);

      const fromPoint = stateBag.startPoint as fabric.Point;
      const endPoint = new fabric.Point(pointer.x, pointer.y);
      const distance = endPoint.distanceFrom(fromPoint);

      const vector = endPoint.subtract(fromPoint);

      // find angle between line's vector and x axis
      let angleRad = Math.atan2(vector.y, vector.x);
      if (angleRad < 0) {
        angleRad = 2 * Math.PI + angleRad;
      }
      const angleDeg = fabric.util.radiansToDegrees(angleRad);

      stateBag.line.width = distance;
      stateBag.line.angle = angleDeg;

      stateBag.line.setCoords();
      canvas.renderAll();
      canvas.fire("object:modified", { target: stateBag.line });
      return;
    }

    if (stateBag.isDragging) {
      const e = opt.e as MouseEvent;
      const vpt = canvas.viewportTransform!;
      vpt[4] += e.clientX - stateBag.lastPosX;
      vpt[5] += e.clientY - stateBag.lastPosY;
      canvas.requestRenderAll();
      stateBag.lastPosX = e.clientX;
      stateBag.lastPosY = e.clientY;

      canvas.setViewportTransform(vpt);
    }
  });
  canvas.on("mouse:up", function (opt) {
    if (editMode === DrawMode.Drawing) {
      stateBag.isDown = false;
      stateBag.line.setCoords();
    } else {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      canvas.setViewportTransform(canvas.viewportTransform!);
      stateBag.isDragging = false;
      canvas.selection = true;
    }
  });

  canvas.on("mouse:wheel", function (opt) {
    const delta = (opt.e as WheelEvent).deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.setZoom(zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });
}
