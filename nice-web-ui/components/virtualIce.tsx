import _ from "lodash";
import {
  ColorsByIndex,
  ILedInfo,
  ILedStatus,
  ILightsClient,
} from "nice-common";
import { useResizeDetector } from "react-resize-detector";

interface IVirtualIceProps {
  ledsStatu: ILedStatus;
}

export const VirtualIce: React.FunctionComponent<IVirtualIceProps> = (
  props
) => {
  const { width, height, ref } = useResizeDetector<HTMLDivElement>();
  const { ledsStatu } = props;

  const xs = ledsStatu.leds.map((l) => l.position.x);
  const ys = ledsStatu.leds.map((l) => l.position.y);

  const leftMost = _.min(xs);
  const rightMost = _.max(xs);
  const ledWidth = rightMost - leftMost;

  const topMost = _.min(ys);
  const bottomMost = _.max(ys);
  const ledHeight = bottomMost - topMost;

  const leds = ledsStatu.leds.map((led) => {
    const { x, y } = led.position;

    const croppedX = x - leftMost;
    const resizedX = (croppedX / ledWidth) * width;

    const croppedY = y - topMost;
    const resizedy = (croppedY / ledHeight) * height;

    return (
      <div
        style={{
          left: resizedX,
          top: resizedy,
          position: "absolute",
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: "red",
        }}
      ></div>
    );
  });

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        border: "1px solid red",
        padding: "10px",
        resize: "both",
      }}
    >
      {leds}
    </div>
  );
};

class PretendLights implements ILightsClient {
  turnOnLights(colorsByIndex: ColorsByIndex): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
