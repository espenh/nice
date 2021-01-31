from lights import Lights, RgbColor
from fastapi import FastAPI, BackgroundTasks
import threading
import asyncio

app = FastAPI()
lights = Lights()


@app.get("/")
async def root():
    await lights.initialize()
    await lights.keepAlive()
    return {"message": "Hello World"}


@app.get("/lights/reset/")
async def reset():
    await lights.initialize()
    await lights.reset()
    return {"message": "Hello World"}


@app.get("/lights/single/")
async def lightsSingle(index: int, color: int):
    await lights.initialize()
    await lights.turnOnSingleLight(index, RgbColor(color))
    return {"index": index, "color": RgbColor(color), "light": True}


async def discord_async_method():
    while True:
        await asyncio.sleep(10)
        await lights.keepAlive()


@app.on_event("startup")
async def startup_event():
    asyncio.get_event_loop().create_task(discord_async_method())
