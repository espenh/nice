import numpy as np
import cv2
from threadedVideoCapture import ThreadedVideoCapture
from action_channel import StreamingCommunication


class DetectorV1:
    def __init__(self, video: ThreadedVideoCapture):
        self.isInitialized = False
        self.kernel = np.ones((5, 5), np.uint8)
        self.fgbg = cv2.createBackgroundSubtractorKNN()

    def processFrame(self, frame):
        frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5,
                           interpolation=cv2.INTER_LINEAR)

        # applying on each frame
        #_, fgmask = cv2.threshold(frame,127,255,cv2.THRESH_BINARY)
        fgmask = self.fgbg.apply(frame)

        fgmask = cv2.medianBlur(fgmask, 5)

        _, fgmask = cv2.threshold(fgmask, 127, 255, cv2.THRESH_BINARY)

        fgmask = cv2.dilate(fgmask, self.kernel, iterations=2)
        #fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_OPEN, kernel)

        contours, h = cv2.findContours(
            fgmask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        foundThings = []
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < 200:
                continue

            detection = tuple(cnt[cnt[:, :, 1].argmax()][0])
            detectionScaled = tuple(x * 2 for x in detection)

            foundThings.append(
                {"x": int(detectionScaled[0]), "y": int(detectionScaled[1])})

        return foundThings
