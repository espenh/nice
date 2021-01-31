import asyncio
import time
import random
from ttls.client import Twinkly, TwinklyFrame

DARK = (0x00, 0x00, 0x00, 0x00)
RED = (0x33, 0xff, 0x00, 0x00)
GREEN = (0x00, 0x00, 0xff, 0x00)
BLUE = (0x00, 0x00, 0x00, 0xff)


def generate_xmas_frame(n: int) -> TwinklyFrame:
    """Generate a very merry frame"""
    res = []
    for i in range(0, n):
        if random.random() > 0.5:
            res.append(RED)
        else:
            res.append(GREEN)
    return res


def dark(n: int) -> TwinklyFrame:
    res = []
    for i in range(0, n):
        res.append(DARK)
    return res


def fromx(frame: TwinklyFrame, index: int, red: int) -> TwinklyFrame:
    frame[index] = (0, round(red), 106, 0)
    return frame


async def main() -> None:
    msg = "Hello World"
    print(msg)

    t = Twinkly(host="192.168.10.191")
    details = await t.get_details()
    await t.interview()
    await t.set_mode('rt')

    # await t.set_static_colour(DARK)
    # time.sleep(0.2)
    # await t.send_frame_2(fromx(100, 400))
    # time.sleep(0.2)

    frame = dark(400)

    fps = 24
    secondsBetweenFrames = 1/fps
    partsRed = 255/400
    
    print(await t.get_brightness())

    for index in range(0, 400):
        print("SETTING %d" % (index))
        frame = fromx(frame, index, index * partsRed)
        await t.send_frame_2(frame)
        time.sleep(secondsBetweenFrames)

    # time.sleep(1)
    # await t.set_static_colour(RED)

    # await t.send_frame_2(dark(400))
    # time.sleep(1)

    # await t.send_frame_2(generate_xmas_frame(400))
    # time.sleep(0.5)
    # await t.send_frame_2(generate_xmas_frame(400))
    # time.sleep(0.5)
    # await t.send_frame_2(generate_xmas_frame(400))
    # time.sleep(0.5)
    # await t.send_frame_2(generate_xmas_frame(400))

    await t.close()

if __name__ == "__main__":
    asyncio.run(main())
