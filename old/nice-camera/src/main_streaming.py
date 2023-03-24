from fastapi import FastAPI
from action_channel import StreamingCommunication
from camera_streaming import CameraStreaming

app = FastAPI()
com = StreamingCommunication()
camera = CameraStreaming(com)


@app.get("/")
async def root():
    com.send_objects([1,2,3])
    return {"message": "Hello Stream"}

@app.on_event("startup")
async def startup_event():
    print(">startup start")
    com.initialize()
    camera.initialize()
    print(">startup end")
