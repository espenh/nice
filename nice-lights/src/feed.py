import cv2
from feedHelper import camera

#cap = cv2.VideoCapture("rtsp://admin:admin@192.168.10.135:554/DeskCamera/webcam1")

cam = camera("rtsp://admin:admin@192.168.10.135:554/DeskCamera/webcam1")
fgbg = cv2.bgsegm.createBackgroundSubtractorMOG()

while(True):
    # Capture frame-by-frame
    frame = cam.get_frame()
    fgmask = fgbg.apply(frame)

    # Display the resulting frame
    cv2.imshow('frame', frame)
    cv2.imshow('mask', fgmask)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
