import asyncio
from lights import Lights, RgbColor

light: Lights = None


async def main() -> None:
    light = Lights()
    print("Initializing")
    await light.initialize()
    print("Turn on")
    await light.turnOnSingleLight(204, RgbColor.red)

    await light.longTest()
    input("Press Enter to continue...")
    await light.close()

if __name__ == "__main__":
    asyncio.run(main())
