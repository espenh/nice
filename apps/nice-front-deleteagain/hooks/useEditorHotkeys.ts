import { useContext, useEffect } from "react";
import { FabricContext } from "../components/contexts/fabricContext";

export function useEditorHotkeys() {
  const { canvas } = useContext(FabricContext);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        const objectsToRemove = canvas.getActiveObjects();
        canvas.remove(...objectsToRemove);

        canvas.discardActiveObject().renderAll();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canvas]);
}
