
import cv2
import numpy as np
from nice_camera import DetectorV1, SimpleVideoCapture

source = './data/Is-161359-161412.mp4'

def dump_frame(frame, name):
    cv2.imwrite('temp_images/' + name + '.png', frame)

print("Creating capture and detector")

mask_diagonal = cv2.imread('./images/diagonal_mask.png', cv2.COLOR_GRAY2BGR)
mask_diagonal = mask_diagonal / 255.0
mask_diagonal_inverted = 1 - mask_diagonal

background_original = cv2.imread('./images/background_original.png')
background_checkered = cv2.imread('./images/background_checkered.png')
background = (mask_diagonal * background_original + mask_diagonal_inverted * background_checkered).clip(0, 255).astype(np.uint8)

# Train the background subtractor
print("Training background subtractor")
training_source = SimpleVideoCapture(source)
bg_subtractor = cv2.createBackgroundSubtractorKNN(history=400, dist2Threshold=300, detectShadows=True)
  
while(1):
    frame = training_source.read()
    if frame is None:
        break

    # The detector resizes the frame, so we need to do the same here.
    # TODO - This whole routine should be part of the detector, like .heat_up(capture).
    frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5, interpolation=cv2.INTER_LINEAR)
    bg_subtractor.apply(frame)


print("Starting main loop")
cap = SimpleVideoCapture(source)
detector = DetectorV1(bg_subtractor)

while(1):
    frame = cap.read()
    if frame is None:
        break
    
    (foundObjects, mask, fgmask_full) = detector.processFrame(frame)

    for bottommost in foundObjects:
        #cv2.circle(frame, (bottommost['x'],bottommost['y']) , 10, (0,0,255),5)
        #cv2.circle(mask, (bottommost['x'],bottommost['y']) , 10, (0,0,255),5)
        pass

    blobs = cv2.bitwise_and(frame,frame,mask = fgmask_full)

    # Dump every x frame to a png file.
    if True: #detector.counter % 10 == 0:
        final = background.copy()
        final[fgmask_full > 0] = blobs[fgmask_full > 0]

        # Crop the left 20% of the final frame
        final_cropped = final[:, int(final.shape[1] * 0.2):]

        # Crop the bottom 30% of the final frame
        final_cropped = final_cropped[:int(final_cropped.shape[0] * 0.7), :]

        cv2.imshow('final_cropped', final_cropped)
        #cv2.imshow('fgmask_full', fgmask_full)
        
        dump_frame(final_cropped, 'final_cropped%d' % detector.counter)
        #dump_frame(frame, 'frame%d' % detector.counter)

    k = cv2.waitKey(30) & 0xff
    if k == 27:
        break

cap.release()
cv2.destroyAllWindows()

# Use ffmpeg and stitch the images in the "images" folder together into a animated webp file.
# ffmpeg -i temp_images/final_cropped%d.png -lossless 0 -q:v 80 -loop 0 -an -vsync 0 -s 760x428 output.webp
