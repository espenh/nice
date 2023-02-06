import asyncio
import io
import random
import struct
import xled

from enum import Enum
from typing import Dict, List, Optional, Tuple


TwinklyColour = Tuple[int, int, int]
TwinklyFrame = List[TwinklyColour]

ledCount = 600


def dark(n: int) -> TwinklyFrame:
    res: List[TwinklyColour] = []
    for i in range(0, n):
        res.append(DARK)
    return res


def dark_frame():
    return dark(ledCount)


DARK: TwinklyColour = (0x00, 0x00, 0x00)
RED: TwinklyColour = (0xFF, 0x00, 0x00)
GREEN: TwinklyColour = (0x00, 0xFF, 0x00)
BLUE: TwinklyColour = (0x00, 0x00, 0xFF)


class RgbColor(Enum):
    red = 0
    green = 1
    blue = 2


colorTypeToColor = {RgbColor.red: RED, RgbColor.green: GREEN, RgbColor.blue: BLUE}


class Lights:
    def __init__(self, device_ip: str):
        self.control = xled.ControlInterface(device_ip)

        self.isInitialized = False
        self.lastFrame: TwinklyFrame | None = None

    async def initialize(self):
        print("initialize")
        if not self.isInitialized:
            self.isInitialized = True
            self.control.get_device_info()
            self.control.set_mode("rt")

    async def reset(self):
        self.control.set_mode("rt")
        await self.sendFrame(dark_frame())

    async def keepAlive(self):
        # TODO - This won't keep anything alive if no frame has been sent.
        if self.lastFrame is None:
            return

        print("lights-keepAlive")
        await self.sendFrame(self.lastFrame)

    async def sendFrame(self, frame: TwinklyFrame):
        self.lastFrame = frame

        pat = [struct.pack(">BBB", line[0], line[1], line[2]) for line in frame]
        movie = io.BytesIO()
        movie.write(b"".join(pat))
        movie.seek(0)
        self.control.set_rt_frame_socket(movie, 3)

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

    async def turnOnMultiple(self, colorsByIndex: Dict[int, Dict[str, int]]):
        frame = dark_frame()
        for index, colors in colorsByIndex.items():
            frame[index] = (colors["r"], colors["g"], colors["b"])

        await self.sendFrame(frame)

    async def turnOnRGBLights(
        self,
        redIndex: Optional[int] = None,
        greenIndex: Optional[int] = None,
        blueIndex: Optional[int] = None,
    ):
        frame = dark(400)

        if redIndex is not None:
            frame[redIndex] = RED

        if greenIndex is not None:
            frame[greenIndex] = GREEN

        if blueIndex is not None:
            frame[blueIndex] = BLUE

        await self.sendFrame(frame)

    async def close(self):
        self.control.session.close()

    async def longTest(self):
        for x in range(0, 100):
            await self.turnOnSingleLight(
                random.randint(0, ledCount), RgbColor(random.randint(0, 2))
            )
            await asyncio.sleep(0.5)

    async def getLedInfo(self):
        details = self.control.get_device_info()
        return details
