import cv2
import numpy as np
from imageUtils import apply_brightness_contrast
import imutils

print("creating capture")
cap = cv2.VideoCapture(1)

print("starting loop")

_, rootFrame = cap.read()

while(True):
    # Capture frame-by-frame
    ret, frame = cap.read()

    if frame is None:
        break

    #frameGray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    #frameRoot = cv2.cvtColor(rootFrame, cv2.COLOR_BGR2GRAY)

    diff = cv2.absdiff(rootFrame, frame)
    #diff = cv2.absdiff(frameRoot, frameGray)
    #diff = cv2.bitwise_and(frame, frame, mask=diff)

    #frameGray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    #before = frameGray.copy()
    #after = cv2.adaptiveThreshold(diffGray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    #ret, after = cv2.threshold(frameGray,0,255,cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)

    diff = apply_brightness_contrast(diff, -10, 50)
    # Convert BGR to HSV
    hsv = cv2.cvtColor(diff, cv2.COLOR_BGR2HSV)
    # define range of red color in HSV
    lower_red = np.array([0, 10, 120])
    upper_red = np.array([15, 255, 255])

    #mask = cv2.inRange(hsv, lower_red, upper_red)
    # Gen lower mask (0-5) and upper mask (175-180) of RED
    mask1 = cv2.inRange(hsv, (0, 50, 20), (5, 255, 255))
    mask2 = cv2.inRange(hsv, (175, 50, 20), (180, 255, 255))

    # Merge the mask and crop the red regions
    mask = cv2.bitwise_or(mask1, mask2)

    contours, hierarchy = cv2.findContours(
        mask.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    if(len(contours) > 0):
        red_area = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(red_area)
        centerx = round(x + (w/2))
        centery = round(y + (h/2))
        cv2.circle(frame, (centerx, centery), 20, (0, 0, 255))

    #cv2.imshow('frame1', frame1)
    cv2.imshow('frame', frame)
    cv2.imshow('diff', diff)
    cv2.imshow('mask', mask)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
