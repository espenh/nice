import asyncio
import random
import threading
import datetime
import time
from client_mods import Twinkly, TwinklyFrame
from enum import Enum
from scenarios.somecode import dark, fromx, RED

ledCount = 400
blankFrame = dark(ledCount)

RED = (0x00, 0xff, 0x00, 0x00)
GREEN = (0x00, 0x00, 0xff, 0x00)
BLUE = (0x00, 0x00, 0x00, 0xff)


class RgbColor(Enum):
    red = 0
    green = 1
    blue = 2


colorTypeToColor = {
    RgbColor.red: RED,
    RgbColor.green: GREEN,
    RgbColor.blue: BLUE
}


class Lights:
    def __init__(self):
        self.t = Twinkly(host="192.168.10.191")
        self.isInitialized = False
        self.lastFrame: TwinklyFrame = None

    async def initialize(self):
        print("initialize")
        if not self.isInitialized:
            self.isInitialized = True
            await self.t.interview()
            await self.t.set_mode('rt')

    async def reset(self):
        await self.t.set_mode('rt')
        await self.sendFrame(blankFrame)

    async def keepAlive(self):
        # TODO - This won't keep anything alive if no frame has been sent.
        if self.lastFrame is None:
            return

        print("lights-keepAlive")
        await self.sendFrame(self.lastFrame)

    async def sendFrame(self, frame: TwinklyFrame):
        self.lastFrame = frame
        await self.t.send_frame_2(frame)

    async def turnOnOnlySingleLight(self, index: int, color: RgbColor):
        frame = dark(400)
        frame[index] = colorTypeToColor[color]
        await self.sendFrame(frame)

    async def turnOnSingleLight(self, index: int, color: RgbColor):
        frame = None
        if self.lastFrame is not None:
            frame = self.lastFrame.copy()
        else:
            frame = dark(ledCount)
            
        frame[index] = colorTypeToColor[color]
        await self.sendFrame(frame)
    
    async def turnOnMultiple(self, colorsByIndex: dict):
        frame = dark(400)
        for index, colors in colorsByIndex.items():
            frame[int(index)] = (0, colors['r'], colors['g'], colors['b'])
        
        await self.sendFrame(frame)
    
    async def turnOnRGBLights(self, redIndex:int=None, greenIndex:int=None, blueIndex:int=None):
        frame = dark(400)
        
        if(redIndex is not None):
            frame[redIndex] = RED
        
        if(greenIndex is not None):
            frame[greenIndex] = GREEN
        
        if(blueIndex is not None):
            frame[blueIndex] = BLUE
        
        await self.sendFrame(frame)

    async def close(self):
        await self.t.close()

    async def longTest(self):
        for x in range(0, 100):
            print("going")
            await self.turnOnSingleLight(random.randint(0, 399), RgbColor(random.randint(0, 2)))
            await asyncio.sleep(35)

    async def getLedInfo(self):
        details = await self.t.get_details()
        return details