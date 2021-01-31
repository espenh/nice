import cv2
import numpy as np
from imageUtils import apply_brightness_contrast
import imutils

print("creating capture")
frame1 = cv2.imread('./tests/data/case2/off.jpg')
frame2 = cv2.imread('./tests/data/case2/one_red.jpg')

diff = cv2.absdiff(frame1, frame2)

diff = apply_brightness_contrast(diff, -10, 50)

# Convert BGR to HSV
hsv = cv2.cvtColor(diff, cv2.COLOR_BGR2HSV)
# define range of red color in HSV
lower_red = np.array([0, 10, 120])
upper_red = np.array([15, 255, 255])

#mask = cv2.inRange(hsv, lower_red, upper_red)
mask1 = cv2.inRange(hsv, (0, 50, 20), (5, 255, 255))
mask2 = cv2.inRange(hsv, (175, 50, 20), (180, 255, 255))

# Merge the mask and crop the red regions
mask = cv2.bitwise_or(mask1, mask2)
contours, hierarchy = cv2.findContours(
        mask.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

red_area = max(contours, key=cv2.contourArea)
x, y, w, h = cv2.boundingRect(red_area)
centerx = round(x + (w/2))
centery = round(y + (h/2))
cv2.circle(frame2, (centerx, centery), 20, (0, 0, 255))

#cv2.imshow('frame1', frame1)
cv2.imshow('frame2', frame2)
cv2.imshow('diff', diff)
cv2.imshow('mask', mask)

cv2.waitKey()
cv2.destroyAllWindows()
