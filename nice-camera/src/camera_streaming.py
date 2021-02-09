import cv2
import numpy as np
import time
import base64
from imageUtils import apply_brightness_contrast
from threadedVideoCapture import ThreadedVideoCapture
from action_channel import StreamingCommunication

class CameraStreaming:
    def __init__(self, communication: StreamingCommunication):
        self.isInitialized = False

    def initialize(self):
        if self.isInitialized:
            return

        self.cap = ThreadedVideoCapture(
            "rtsp://admin:rosenborg@192.168.10.177:554/h264Preview_01_main")
        self.isInitialized = True

        