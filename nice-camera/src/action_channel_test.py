from action_channel import StreamingCommunication
from camera_streaming import CameraStreaming

com = StreamingCommunication()
com.initialize()

camera = CameraStreaming(com)
camera.initialize()