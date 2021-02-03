import cv2
import numpy as np
import time
import base64
from imageUtils import apply_brightness_contrast


class Camera:
    def __init__(self):
        self.isInitialized = False

    def initialize(self):
        print("initialize")
        if self.isInitialized:
            return

        print("creating capture")
        self.cap = cv2.VideoCapture(1)
        self.takeBaseline()
        self.isInitialized = True

    def capture(self):
        _, frame = self.cap.read()
        return frame

    def takeBaseline(self):
        self.baseLine = self.capture()

    def getBaseLineAsBase64(self):
        _, buffer = cv2.imencode('.jpg', self.baseLine)
        encoded = base64.b64encode(buffer)
        return encoded

    def captureRgb(self):
        frame1 = self.baseLine
        frame2 = self.capture()

        diff = cv2.absdiff(frame1, frame2)

        diff = apply_brightness_contrast(diff, -10, 50)

        # Convert BGR to HSV
        hsv = cv2.cvtColor(diff, cv2.COLOR_BGR2HSV)

        redMask1 = cv2.inRange(hsv, (0, 50, 20), (5, 255, 255))
        redMask2 = cv2.inRange(hsv, (175, 50, 20), (180, 255, 255))
        redMask = cv2.bitwise_or(redMask1, redMask2)
        greenMask = cv2.inRange(hsv, (36, 25, 25), (70, 255,255))
        blueMask = cv2.inRange(hsv, (100,150,0), (140,255,255))

        colors = [
            {
                "name": "red",
                "mask": redMask,
                "highlight": (0,0,255)
            },
            {
                "name": "green",
                "mask": greenMask,
                "highlight": (0,255,0)
            },
            {
                "name": "blue",
                "mask": blueMask,
                "highlight": (255,0,0)
            }
        ]

        timestr = time.strftime("%Y%m%d-%H%M%S")
        foundColors = {}
        for color in colors:
            colorMask = color['mask']
            colorName = color['name']
            colorHighlight = color['highlight']

            foundColor = self.findColor(timestr+"_"+colorName, colorMask)
            if(foundColor is None):
                cv2.imwrite('./captures/fail/' + timestr + 'fail_'+ colorName +'_mask.jpg', colorMask)
            else:
                cv2.circle(frame2, (foundColor['x'], foundColor['y']), 20, colorHighlight)
                cv2.circle(colorMask, (foundColor['x'], foundColor['y']), 20, colorHighlight)   
                foundColors[colorName] = foundColor

        if(len(foundColors) == 0):
            cv2.imwrite('./captures/fail/' + timestr + 'fail_baseline.jpg', self.baseLine)
            cv2.imwrite('./captures/fail/' + timestr + 'fail_frame.jpg', frame2)
        else:
            cv2.imwrite('./captures/success/' + timestr + '_baseline.jpg', self.baseLine)
            cv2.imwrite('./captures/success/' + timestr + '_frame.jpg', frame2)
            
        
        if(len(foundColors) == 0):
            return {
                "result": "fail"
            }

        return {
            "result": "success",
            "red": foundColors.get("red"),
            "green": foundColors.get("green"),
            "blue": foundColors.get("blue")
        }

    def findColor(self, name, mask):
        contours, hierarchy = cv2.findContours(
            mask.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        if(len(contours) == 0):
            return None

        colored_area = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(colored_area)
        centerx = round(x + (w/2))
        centery = round(y + (h/2))

        return {
            "x": centerx,
            "y": centery
        }
