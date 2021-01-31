from fastapi import FastAPI
from camera import Camera

app = FastAPI()
camera = Camera()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/capture/baseline")
async def captureBaseline():
    camera.takeBaseline()
    return {"baseline": "yes"}


@app.get("/capture/rgb/")
async def captureRgb():
    capture = camera.captureRgb()
    return capture


@app.on_event("startup")
async def startup_event():
    camera.initialize()
