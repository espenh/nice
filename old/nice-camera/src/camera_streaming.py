import cv2
import numpy as np
import time
import base64
import threading
from imageUtils import apply_brightness_contrast
from threadedVideoCapture import ThreadedVideoCapture
from action_channel import StreamingCommunication
from detector_v1 import DetectorV1


class CameraStreaming:
    def __init__(self, communication: StreamingCommunication):
        self.isInitialized = False
        self.communication = communication

    def initialize(self):
        if self.isInitialized:
            return

        self.cap = ThreadedVideoCapture(
            "rtsp://admin:rosenborg@192.168.10.177:554/h264Preview_01_main")
        self.isInitialized = True

        self.detector = DetectorV1(self.cap)

        t = threading.Thread(target=self.runDetector)
        t.daemon = True
        t.start()

    def runDetector(self):
        sentZero = False
        while True:
            frame = self.cap.read()
            if frame is None:
                break

            (foundObjects, mask) = self.detector.processFrame(frame)
            foundObjectCount = len(foundObjects)

            if foundObjectCount > 0 or not sentZero:
                self.communication.send_objects({
                    "type": "detected-objects",
                    "coordinates": foundObjects
                })

                # If we detect zero object in frame,
                # let server know, but don't keep sending zeroes.
                sentZero = foundObjectCount == 0

            time.sleep(0.1)
