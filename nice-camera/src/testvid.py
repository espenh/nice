import numpy as np 
import cv2 
  
cap = cv2.VideoCapture('./data/sample_night_single.mp4') 
#cap = cv2.VideoCapture('./data/sample_day_single.mp4') 
  
# initializing subtractor  
fgbg = cv2.bgsegm.createBackgroundSubtractorMOG(noiseSigma=0.1)  
  
while(1): 
    ret, frame = cap.read()        

    frame = cv2.resize(frame, (0,0), fx=0.5, fy=0.5, interpolation = cv2.INTER_LINEAR)
    # applying on each frame 
    fgmask = fgbg.apply(frame)   
  
    #contours,h = cv2.findContours(fgmask, cv2.RETR_EXTERNAL , cv2.CHAIN_APPROX_SIMPLE)
    contours,h = cv2.findContours(fgmask, cv2.RETR_TREE , cv2.CHAIN_APPROX_SIMPLE)
    contours,h = cv2.findContours(fgmask, cv2.RETR_TREE , cv2.CHAIN_APPROX_NONE)

    for cnt in contours:
        area = cv2.contourArea(cnt)
        # print (area)
        if area <500:
            continue
        x,y,w,h = cv2.boundingRect(cnt)
        offset = 3    
        cv2.rectangle(frame,(x-offset,y-offset),(x+w+offset,y+h+offset),(0,255,0),2)

    cv2.imshow('frame', frame) 
    cv2.imshow('mask', fgmask) 
    k = cv2.waitKey(30) & 0xff
    if k == 27: 
        break
  
cap.release() 
cv2.destroyAllWindows() 
