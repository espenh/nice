import _ from "lodash";
import { useContext, useEffect } from "react";
import { FabricContext } from "../context/fabricContext";

export function useEditorObjectState() {
  const { canvas } = useContext(FabricContext);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const eventsToTrack = [
      "object:moving",
      "object:scaling",
      "object:rotating",
      "object:skewing",
      "object:added",
      "object:modified",
      "object:removed",
    ];

    const dumpState = _.debounce(() => {
      const allObjects = canvas.getObjects();
      const leds = allObjects.filter((o) => o.data?.type === "led");
      const nonLedOBjects = allObjects.filter((o) => o.data?.type !== "led");

      const obscuredLeds = _.uniq(
        nonLedOBjects.flatMap((obscuring) => {
          return leds.filter((l) => l.intersectsWithObject(obscuring));
        })
      );

      console.log(obscuredLeds);
    }, 1000);

    eventsToTrack.forEach((event) => {
      canvas.on(event, () => {
        dumpState();
      });
    });
  }, [canvas]);
}
