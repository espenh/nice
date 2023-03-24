from fastapi import FastAPI
from camera_rgb import CameraRgb

app = FastAPI()
camera = CameraRgb()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/capture/baseline")
async def baseline_capture():
    camera.takeBaseline()
    return {"baseline": "yes"}

@app.get("/capture/baseline/get")
async def baseline_get():
    baselineAsB64 = camera.getBaseLineAsBase64()
    return {"baseline": baselineAsB64}

@app.get("/capture/rgb/")
async def capture_rgb():
    capture = camera.captureRgb()
    return capture

@app.on_event("startup")
async def startup_event():
    camera.initialize()
