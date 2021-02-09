import numpy as np 
import cv2 
  
#cap = cv2.VideoCapture('./data/sample_night_single.mp4') 
#cap = cv2.VideoCapture('./data/sample_day_single.mp4') 
cap = cv2.VideoCapture('./data/sample_day_real_1.mp4') 
  
# initializing subtractor  
#fgbg = cv2.bgsegm.createBackgroundSubtractorMOG()  
fgbg = cv2.createBackgroundSubtractorKNN()
#fgbg = cv2.createBackgroundSubtractorMOG2()

width  = cap.get(cv2.CAP_PROP_FRAME_WIDTH)   # float `width`
height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)  # float `height`
print((width,height))

kernel = np.ones((5, 5), np.uint8)

while(1): 
    ret, frame = cap.read()        

    frame = cv2.resize(frame, (0,0), fx=0.5, fy=0.5, interpolation = cv2.INTER_LINEAR)
    
    # applying on each frame 
    fgmask = fgbg.apply(frame)   
    
    fgmask = cv2.medianBlur(fgmask, 5)
  
    
    fgmask = cv2.dilate(fgmask, kernel, iterations = 2)
    #fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_OPEN, kernel)

    contours,h = cv2.findContours(fgmask, cv2.RETR_TREE , cv2.CHAIN_APPROX_SIMPLE)

    uniqueContours = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        # print (area)
        if area <500:
            continue
        
        #for existingContours in uniqueContours:
            #cv2.
        x,y,w,h = cv2.boundingRect(cnt)
        #offset = 0    
        #cv2.rectangle(frame,(x-offset,y-offset),(x+w+offset,y+h+offset),(0,255,0),2)
        #point = (round(x+(w/2)),round(y + h))
        #cv2.circle(frame, point, 10, (0,0,255), 5)
        cv2.drawContours(frame, [cnt], -1, (0, 255, 0), 3)
        bottommost = tuple(cnt[cnt[:,:,1].argmax()][0])
        #print(bottommost)
        #bottomCenter = (round(x+(w/2)), bottommost)
        cv2.circle(frame, bottommost , 10, (0,0,255),5)

    cv2.imshow('frame', frame) 
    cv2.imshow('mask', fgmask) 

    k = cv2.waitKey(30) & 0xff
    if k == 27: 
        break
  
cap.release() 
cv2.destroyAllWindows() 
