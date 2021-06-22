import React, { useEffect, useRef } from "react";
import { useOpenCv } from "../hooks/useOpencv";

export default function Vision() {
  return (
    <>
      <Wrapper>
        <Internal />
      </Wrapper>
    </>
  );
}

declare const cv: any;

const Internal: React.FunctionComponent = () => {
  const videoRef = useRef<HTMLVideoElement>();
  const outputMaskRef = useRef<HTMLCanvasElement>();
  const outputFrameRef = useRef<HTMLCanvasElement>();

  console.log("hey");
  console.log(cv);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (!outputMaskRef.current) {
      return;
    }

    if (!outputFrameRef.current) {
      return;
    }
    const kernel = new cv.Mat(5, 5, cv.CV_8UC1, [1, 1, 1, 1]);

    const video = videoRef.current;

    let cap = new cv.VideoCapture(videoRef.current);

    // take first frame of the video
    let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let mask = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let fgbg = new cv.BackgroundSubtractorMOG2(500, 128, false);
    cap.read(frame);

    const FPS = 30;
    function processVideo() {
      try {
        let begin = Date.now();

        // start processing.
        cap.read(frame);
        fgbg.apply(frame, mask);

        cv.medianBlur(mask, mask, 5);

        cv.threshold(mask, mask, 127, 255, cv.THRESH_BINARY);

        cv.dilate(mask, mask, kernel);

        const hierarchy = new cv.Mat();
        const contours = new cv.MatVector();
        //let contours = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        cv.findContours(
          mask,
          contours,
          hierarchy,
          cv.RETR_TREE,
          cv.CHAIN_APPROX_SIMPLE
        );

        for (let i = 0; i < contours.size(); ++i) {
          let hier = contours.get(i);
          //console.log(cv.contourArea(hier));
        }

        console.log("contours: " + contours.size());

        for (let i = 0; i < contours.size(); ++i) {
          let color = new cv.Scalar(255, 0, 0);
          cv.drawContours(
            frame,
            contours,
            i,
            color,
            5,
            cv.LINE_8,
            hierarchy,
            100
          );
        }

        /*let color = new cv.Scalar(255, 0, 0, 255);
        for (let i = 0; i < contours.size(); ++i) {
          cv.drawContours(
            mask,
            contours,
            i,
            color,
            1,
            cv.LINE_8,
            hierarchy,
            100
          );
        }*/
        //cv.imshow("canvasOutput", src);

        /*foundThings = []
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < 200:
                continue

            detection = tuple(cnt[cnt[:, :, 1].argmax()][0])
            
            # We scale down for processing, so scale back up here.
            detectionScaled = tuple(x * 2 for x in detection)

            foundThings.append(
                {"x": int(detectionScaled[0]), "y": int(detectionScaled[1])})*/

        /*cv.cvtColor(frame, hsv, cv.COLOR_RGBA2RGB);
        cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);
        cv.calcBackProject(hsvVec, [0], roiHist, dst, [0, 180], 1);

        // Apply meanshift to get the new location
        // and it also returns number of iterations meanShift took to converge,
        // which is useless in this demo.
        [, trackWindow] = cv.meanShift(dst, trackWindow, termCrit);

        // Draw it on image
        let [x, y, w, h] = [
          trackWindow.x,
          trackWindow.y,
          trackWindow.width,
          trackWindow.height,
        ];*/
        /*cv.rectangle(
          mask,
          new cv.Point(10, 20),
          new cv.Point(50, 60),
          [255, 0, 0, 255],
          2
        );*/

        cv.imshow(outputMaskRef.current, mask);
        cv.imshow(outputFrameRef.current, frame);

        // schedule the next one.
        let delay = 1000 / FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
      } catch (err) {
        console.error(err);
      }
    }

    // schedule the first one.
    setTimeout(processVideo, 0);
  }, [videoRef, outputMaskRef, outputFrameRef]);

  return (
    <div>
      <video
        ref={videoRef}
        height={200}
        width={400}
        playsInline={true}
        muted={true}
        autoPlay={true}
        loop={true}
        controls={true}
        src="/videos/vision/sample_day_real_1_resized.mp4"
      ></video>
      <canvas
        ref={outputMaskRef}
        height={200}
        width={400}
        style={{ border: "1px solid red" }}
      />
      <canvas
        ref={outputFrameRef}
        id="canvasOutput"
        height={200}
        width={400}
        style={{ border: "1px solid red" }}
      />
    </div>
  );
};

const Wrapper: React.FunctionComponent = ({ children }) => {
  const ready = useOpenCv();

  if (ready) {
    return <>{children}</>;
  }

  return <div>NA</div>;
};
