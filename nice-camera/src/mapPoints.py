import numpy as np 
import cv2
import json
  
frame = cv2.imread("./data/mapping_2021-02-06_235555_baseline.jpg")

with open('./data/mapping_2021-02-06_235555_result.json') as f:
    data = json.load(f)

    for point in data['foundLeds']:
        x = point['position']['x']
        y = point['position']['y']

        cv2.circle(frame,(x,y), 25,(0,255,0),2)


    
    frame = cv2.resize(frame, (0,0), fx=0.5, fy=0.5, interpolation = cv2.INTER_LINEAR)
    cv2.imshow('frame', frame) 
    k = cv2.waitKey() & 0xff

cap.release() 
cv2.destroyAllWindows() 
