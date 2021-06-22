import { useContext, useEffect, useMemo, useRef } from "react";
import { Pane } from "tweakpane";
import { ActionConnectionContext } from "../contexts/actionConnectionContext";
import { FabricContext } from "../contexts/fabricContext";

export const ObjectProperties: React.FunctionComponent = () => {
  const { canvas } = useContext(FabricContext);
  const { sendMessage } = useContext(ActionConnectionContext);
  const containerRef = useRef(null);

  const pane = useMemo(() => {
    const container = containerRef.current;

    if (container) {
      console.log("CONOAINOAEI");
      const pane = new Pane({ expanded: true, container: container });
      return pane;
    }
  }, [containerRef]);

  useEffect(() => {
    if (!canvas || !pane) {
      return;
    }

    const objectParams = {
      color: "#0f0",
    };

    const color = pane.addInput(objectParams, "color", { label: "Color" });
    color.on("change", (newColor) => {
      const activeObjects = canvas.getActiveObjects();
      for (const object of activeObjects) {
        object.set("fill", newColor.value);
      }
      canvas.renderAll();

      for (const object of activeObjects) {
        canvas.fire("object:modified", { target: object });
      }
    });

    canvas.on("selection:created", () => {
      const activeObject = canvas.getActiveObjects()[0];
      if (activeObject) {
        objectParams.color = activeObject.fill?.toString() ?? "pink";
        pane.refresh();
      }
    });

    const effects = pane.addFolder({ title: "Effects" });
    const btn = effects.addButton({
      title: "Boom",
    });

    btn.on("click", () => {
      const activeObjects = canvas.getActiveObjects();
      for (const object of activeObjects) {
        sendMessage({
          type: "trigger-effect",
          targetObjectId: object.data?.id,
          effectType: "glow",
        });
      }
    });
  }, [canvas, pane]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        display: "flex",
        minWidth: 1,
        minHeight: 1,
      }}
    ></div>
  );
};
