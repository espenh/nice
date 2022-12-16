import cv2
import numpy as np
from imageUtils import apply_brightness_contrast
import imutils

print("creating capture")
frame1 = cv2.imread('./tests/data/case1/off.jpg')
frame2 = cv2.imread('./tests/data/case1/one_red.jpg')

diff = cv2.absdiff(frame1, frame2)

diff = apply_brightness_contrast(diff, -10, 50)


gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
blur = cv2.GaussianBlur(gray, (9, 9), 0)
thresh = cv2.adaptiveThreshold(
    blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 23, 3)

# Find contours and filter using contour area
cnts = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cnts = cnts[0] if len(cnts) == 2 else cnts[1]

c = max(cnts, key=cv2.contourArea)
cv2.drawContours(frame2, [c], -1, (36, 255, 12), 1)


#cv2.imshow('frame1', frame1)
cv2.imshow('frame2', frame2)
cv2.imshow('diff', diff)


cv2.waitKey()
cv2.destroyAllWindows()
