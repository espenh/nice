import { fabric } from "fabric";
import React, { createContext, useCallback, useState } from "react";

interface IFabricContextProps {
  canvas: fabric.Canvas | null;
  initCanvas(el: HTMLCanvasElement): void;
  activeObject: any;
  setActiveObject(object: any): void;
}

export const FabricContext = createContext<IFabricContextProps>(
  (undefined as unknown) as IFabricContextProps
);

export const FabricContextProvider: React.FunctionComponent<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState(null);

  const initCanvas = useCallback((el: HTMLCanvasElement) => {
    const canvasOptions = {
      preserveObjectStacking: true,
      selection: true,
      defaultCursor: "default",
    };
    const canvas = new fabric.Canvas(el, canvasOptions);
    canvas.renderAll();
    setCanvas(canvas);
  }, []);

  return (
    <FabricContext.Provider
      value={{
        canvas,
        initCanvas,
        activeObject,
        setActiveObject,
      }}
    >
      {children}
    </FabricContext.Provider>
  );
};
