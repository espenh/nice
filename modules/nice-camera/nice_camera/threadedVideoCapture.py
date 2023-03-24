import cv2
import queue
import threading

class SimpleVideoCapture:
    def __init__(self, source):
        print("Creating capture with source: " + source)
        self.cap = cv2.VideoCapture(source, cv2.CAP_FFMPEG)

    def read(self):
        ret, frame = self.cap.read()
        return frame

    def release(self):
        self.cap.release()


class ThreadedVideoCapture:
    def __init__(self, source):
        print("Creating capture with source: " + source)
        self.cap = cv2.VideoCapture(source, cv2.CAP_FFMPEG)
        self.q = queue.Queue()
        t = threading.Thread(target=self._reader)
        t.daemon = True
        t.start()
    # read frames as soon as they are available, keeping only most recent one

    def _reader(self):
        while True:
            ret, frame = self.cap.read()
            if not ret:
                break
            if not self.q.empty():
                try:
                    self.q.get_nowait()   # discard previous (unprocessed) frame
                except queue.Empty:
                    print("queue empty")
                    pass
            self.q.put(frame)

    def read(self):
        return self.q.get()
    
    def release(self):
        self.cap.release()
