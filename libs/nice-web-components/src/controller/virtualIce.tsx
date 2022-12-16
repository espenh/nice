import _ from "lodash";
import { ColorsByIndex, ILedStatus } from "@nice/nice-common";
import { useMemo } from "react";
import { useResizeDetector } from "react-resize-detector";

interface IVirtualIceProps {
  ledStatus: ILedStatus;
  colorsByIndex: ColorsByIndex;
}

// TODO - This whole component is very naively implemented and causes a bunch of unnecessary re-renders.
export const VirtualIce: React.FunctionComponent<IVirtualIceProps> = (
  props
) => {
  const { width, height, ref } = useResizeDetector();
  const { ledStatus, colorsByIndex } = props;

  // Get the dimensions of the led area, stripping away all the non-led padding from the baseline picture (ice).
  const { leftMost, ledAreaWidth, topMost, ledAreaHeight } = useMemo(() => {
    const xs = ledStatus.leds.map((l) => l.position.x);
    const ys = ledStatus.leds.map((l) => l.position.y);

    const leftMost = _.min(xs);
    const rightMost = _.max(xs);
    const ledAreaWidth = rightMost - leftMost;

    const topMost = _.min(ys);
    const bottomMost = _.max(ys);
    const ledAreaHeight = bottomMost - topMost;

    return { leftMost, ledAreaWidth, topMost, ledAreaHeight };
  }, [ledStatus]);

  const dimensionsAreInvalid = !width || !height;
  const leds = dimensionsAreInvalid
    ? []
    : ledStatus.leds.map((led) => {
        const { x, y } = led.position;

        const croppedX = x - leftMost;
        const resizedX = (croppedX / ledAreaWidth) * width;

        const croppedY = y - topMost;
        const resizedy = (croppedY / ledAreaHeight) * height;

        const colorComponents = colorsByIndex[led.index];
        const ledColor = colorComponents
          ? `rgba(${colorComponents.r}, ${colorComponents.g}, ${colorComponents.b}, 0.9)`
          : "rgba(0,0,0,0.5)";

        const ledSize = colorComponents ? 6 : 4;
        const ledSizeHalf = ledSize / 2;
        const spreadRadius = colorComponents ? 3 : 0;

        return (
          <div
            key={led.index.toString()}
            style={{
              left: resizedX - ledSizeHalf,
              top: resizedy - ledSizeHalf,
              position: "absolute",
              width: ledSize,
              height: ledSize,
              transition: "all 0.2s ease",
              borderRadius: "50%",
              backgroundColor: ledColor,
              boxShadow: `0 0 10px ${spreadRadius}px ${ledColor}`,
            }}
          ></div>
        );
      });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: "10px",
        background:
          "conic-gradient(from 90deg at 50% 0%, #222, 50%, #444, #222)",
      }}
    >
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {leds}
      </div>
    </div>
  );
};
