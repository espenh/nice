import cv2

print("creating capture")
cap = cv2.VideoCapture(1)
fgbg = cv2.bgsegm.createBackgroundSubtractorMOG()

print("starting loop")

while(True):
    # Capture frame-by-frame
    ret, frame = cap.read()

    if frame is None:
        break

    #gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    fgmask = fgbg.apply(frame)

    # Display the resulting frame
    cv2.imshow('frame',frame)
    cv2.imshow('mask',fgmask)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()