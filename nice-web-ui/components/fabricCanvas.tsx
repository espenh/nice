import React, { useCallback, useContext, useEffect, useRef } from "react";
import { useResizeDetector } from "react-resize-detector";
import { FabricContext } from "../context/fabricContext";

interface IFabricCanvasProps {}

export const FabricCanvas: React.FunctionComponent<IFabricCanvasProps> = () => {
  const canvasEl = useRef(null);
  const { canvas, initCanvas, setActiveObject } = useContext(FabricContext);
  const {
    width,
    height,
    ref: containerRef,
  } = useResizeDetector<HTMLDivElement>();

  useEffect(() => {
    const currentElement = canvasEl.current;
    if (currentElement === null) {
      return;
    }

    initCanvas(currentElement);
  }, [canvasEl, initCanvas]);

  const updateActiveObject = useCallback(() => {
    if (!canvas) {
      return;
    }
    setActiveObject(canvas.getActiveObject());
    canvas.renderAll();
  }, [canvas, setActiveObject]);

  useEffect(() => {
    if (!canvas) {
      return;
    }
    canvas.on("selection:created", updateActiveObject);
    canvas.on("selection:updated", updateActiveObject);
    canvas.on("selection:cleared", updateActiveObject);

    return () => {
      canvas.off("selection:created");
      canvas.off("selection:cleared");
      canvas.off("selection:updated");
    };
  }, [canvas, updateActiveObject]);

  useEffect(() => {
    if (!canvas || width === undefined || height === undefined) {
      return;
    }

    canvas.setDimensions({
      width: width,
      height: height,
    });
  }, [canvas, width, height]);

  return (
    <div ref={containerRef} style={wrapperStyle}>
      <canvas ref={canvasEl} id="fabric-canvas" />
    </div>
  );
};

const wrapperStyle = { width: "100%", height: "100%" };
