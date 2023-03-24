import numpy as np
import cv2

class DetectorV1:

    noise_ellipse = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
    closing_ellipse = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (35,35))
    
    def __init__(self, background_subtractor):
        self.isInitialized = False
        self.kernel = np.ones((5, 5), np.uint8)
        self.background_subtractor = background_subtractor
        
        if False:
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            self.outFrame = cv2.VideoWriter('output_frame.mp4',fourcc,20,(800,600))
            self.outMask = cv2.VideoWriter('output_mask.mp4',fourcc,20,(800,600),0)

        self.counter = 0

    def processFrame(self, frame):
        frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5,
                           interpolation=cv2.INTER_LINEAR)

        fgmask = self.background_subtractor.apply(frame)
        
        fgmask = cv2.medianBlur(fgmask, 5)
        
        _, fgmask = cv2.threshold(fgmask, 127, 255, cv2.THRESH_BINARY)
        
        fgmask = cv2.dilate(fgmask, self.kernel, iterations=2)

        # Remove noise
        # fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_OPEN, self.noise_ellipse)
        # Fill in holes
        fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_CLOSE, self.closing_ellipse)


        contours, _ = cv2.findContours(
            fgmask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            #fgmask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        foundThings = []
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < 200:
                continue

            detection = tuple(cnt[cnt[:, :, 1].argmax()][0])
            
            # We scale down for processing, so scale back up here.
            detectionScaled = tuple(x * 2 for x in detection)

            foundThings.append(
                {"x": int(detectionScaled[0]), "y": int(detectionScaled[1])})            

        self.counter+=1

        if(False):
            # This is for writing the output stream while developing.
            for bottommost in foundThings:
                cv2.circle(frame, (bottommost['x'],bottommost['y']) , 10, (0,0,255),5)
                cv2.circle(fgmask, (bottommost['x'],bottommost['y']) , 10, (0,0,255),5)
            
            self.outMask.write(cv2.resize(fgmask, (800, 600)))
            self.outFrame.write(cv2.resize(frame, (800, 600)))

            

            if(self.counter >= 24*60*2):
                self.outFrame.release()
                self.outMask.release()
                raise NameError('HiThere')
        
        fgmask_full = cv2.resize(fgmask, (0, 0), fx=2, fy=2,
                           interpolation=cv2.INTER_LINEAR)


        return (foundThings, fgmask, fgmask_full)
