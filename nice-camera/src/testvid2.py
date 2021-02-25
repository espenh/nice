import numpy as np
import cv2
import time
from detector_v1 import DetectorV1
from threadedVideoCapture import ThreadedVideoCapture

#source = 'rtsp://admin:rosenborg@192.168.10.177:554/h264Preview_01_main'
#source = './data/sample_night_single.mp4'
#source = './data/sample_day_single.mp4'
source = './data/sample_day_real_1.mp4'
#source = './data/sample_night_hard.mp4'

cap = ThreadedVideoCapture(source)
detector = DetectorV1(cap)

while(1):
    frame = cap.read()
    
    (foundObjects, mask) = detector.processFrame(frame)
    
    for bottommost in foundObjects:
        cv2.circle(frame, (bottommost['x'],bottommost['y']) , 10, (0,0,255),5)
        cv2.circle(mask, (bottommost['x'],bottommost['y']) , 10, (0,0,255),5)

    cv2.imshow('frame', frame)
    cv2.imshow('mask', mask)

    k = cv2.waitKey(30) & 0xff
    if k == 27:
        break

cap.release()
cv2.destroyAllWindows()
