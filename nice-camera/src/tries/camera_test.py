import cv2

from camera import Camera
camera = Camera()
camera.initialize()
points =camera.captureRgb()
print(points)

baseline = camera.getBaseLineAsBase64()
print(baseline)

cv2.waitKey()
cv2.destroyAllWindows()