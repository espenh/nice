import { LightsApiClient } from "@nice/nice-common-node";
import * as chalk from "chalk";
import dayjs from "dayjs";
import * as fs from "fs";
import * as _ from "lodash";
import { CameraApiClient } from "./cameraApiClient";

console.log("nice-mapper started");

interface ILedAnd2DPosition {
  index: number;
  position: I2DPosition;
}

interface I2DPosition {
  x: number;
  y: number;
}

async function runMapping() {
  const lights = new LightsApiClient("http://localhost:8001");
  const camera = new CameraApiClient("http://localhost:8000");

  const { number_of_led: ledCount } = await lights.getLedInfo();

  // Basic 2d mapping algorithm.
  // 1: Turn on 3 leds. One red, one green and one blue.
  // 2: Take snapshot from camera with 2d position of red, green and blue.
  // 3: Keep iterating over the leds until all leds have been mapped.

  // The leds are ordered by the position on the wire,
  // so index 0 is the first led, followed by index 1 etc.
  // To make the mapping easier we should turn on leds that are
  // likely to have some distance between them. This is to make the
  // color mapping easier (green light not interferring with the blue etc.).

  // For now just shuffle the indexes. A future improvement would be to pick indexes
  // in a way that keeps distance between all three lights.
  const foundLeds: ILedAnd2DPosition[] = [];
  const unknownIndexes: number[] = [];
  const ledIndexesInRgbGroups = _.chunk(_.shuffle(_.range(0, ledCount)), 3);

  // Turn off all lights and capture a frame that's used to remove background in the mapping process.
  await lights.reset();
  await camera.setBaseline();
  const baseLineResponse = await camera.getBaseline();

  while (ledIndexesInRgbGroups.length > 0) {
    const rgbIndexGroup = ledIndexesInRgbGroups.pop()!;
    const [redIndex, greenIndex, blueIndex] = rgbIndexGroup;

    await lights.turnOnLightRgb({ redIndex, greenIndex, blueIndex });
    const capturedRgb = await camera.captureRgb();
    if (capturedRgb.result === "fail") {
      console.warn(`Failed capture, indexes: ${rgbIndexGroup.join(",")}`);
      unknownIndexes.push(...rgbIndexGroup);
      // TODO: Try again in a different ordering?
    } else {
      const checks = [
        {
          index: redIndex,
          capture: capturedRgb.red,
          outputColor: chalk.red,
        },
        {
          index: greenIndex,
          capture: capturedRgb.green,
          outputColor: chalk.green,
        },
        {
          index: blueIndex,
          capture: capturedRgb.blue,
          outputColor: chalk.blue,
        },
      ];

      checks.forEach((check) => {
        if (check.capture) {
          foundLeds.push({
            index: check.index,
            position: check.capture,
          });

          console.log(
            `Found led at: (${check.outputColor(
              check.capture.x
            )},${check.outputColor(check.capture.y)})`
          );
        } else {
          unknownIndexes.push(check.index);
        }
      });
    }
  }

  return {
    baseLine: baseLineResponse.baseline,
    result: { foundLeds, unknownIndexes },
  };
}

async function run() {
  try {
    const mapping = await runMapping();
    const timestamp = dayjs().format("yyyy-MM-dd_HHmmss");
    fs.writeFileSync(
      `${`./mapping_` + timestamp}_baseline.jpg`,
      mapping.baseLine,
      { encoding: "base64" }
    );
    fs.writeFileSync(
      `${`./mapping_` + timestamp}_result.json`,
      JSON.stringify(mapping.result, null, 2)
    );
  } catch (error) {
    console.error(error);
  }
}

run();
