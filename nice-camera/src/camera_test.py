import cv2

from camera import Camera
camera = Camera()
camera.initialize()
points =camera.captureRgb()
print(points)

cv2.waitKey()
cv2.destroyAllWindows()