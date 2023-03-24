# nice

![nice image header](/docs/images/readme/nice_repo_header.webp)

<p>This is the code for a <b>reactive, light-up ice-rink</b> using wifi-enabled LEDs embedded in ice, and then some opencv based computer vision tinkering to light up the ice as people skate on it.</p>

---

![nice image header](/docs/images/readme/nice_collage.webp)

## LEDs in ice

The LEDs are addressable by index on the wire, so if you have the 400-LED version you can assign red to index 0, green to index 1, all the way up to index 399. To enable more interesting things, we need to map the LEDs into 2d space so we can take a point from the camera frame and figure out which leds are on or close to that point. This mapping is done in [nice-mapper](/apps/nice-mapper/), and the process is pretty simple:

- Turn off the LEDs.
- Light up 3 random LEDs in easy to map colors, [a=red], [b=green] and [c=blue].
- Capture a frame from the overhead camera.
- Find the glowing LEDs in the frame and assign their on-ice coordinates.
- Continue until all leds are mapped.

![nice image header](/docs/images/readme/nice_mapping_process.webp)

Here you can see mapping of LEDs on the office floor, then on a blurry frame from camera positioned over the ice, and lastly the terminal showing the assigned on-ice 2d coordinates.

This mapping approach is a probably a very basic version of what [Twinkly](https://twinkly.com/) use in their led mapping, where they also support mapping the LEDs in 3d as you pan around your Christmas tree.

## Ice editor

The ice editor allows drawing things on the ice, currently in the form of rectangles. These virtual objects could be assigned different on-ice behaviours. They could be virtual hockey goals, ice skating targets-to-hit for practicing, or moving enemies to skate around.

![alt tag](/docs/images/readme/nice_editor.webp)

Note: Clicking the "Boom" button applies a temporary [highlight effect](/libs/nice-common/src/effects/highlightObjectEffect.ts) on the selected object.

The ice editor is in [nice-front](/apps/nice-front/). There's a ice simulator that allows you to test out the editor without first building an ice rink.

### Ice simulator

Since we don't have ice conditions all year around, there's an ice "simulator" available to dry-run the editor and test various effects.

![ice simulator](/docs/images/readme/nice_ice_simulator.webp)

This uses the same orchestration code (director etc.), but pipes the messages to a fake light client that "turns on LEDs" by changing the state of a virtual-ice React component.

To run:

```bash
yarn nx serve nice-front
```

Then open http://localhost:4200/nice.

## Vision

With the LEDs trapped in ice, how can we get them to light up as people skate over them?

Using a camera mounted high up we can capture an overhead view of the ice, and since we have all the LEDs mapped in 2d space, we can easliy translate a point in the camera frame to a LED in the ice.

Now all that's left is to process the camera video stream and for every frame find and track the moving things - mostly people, but it would be nice to also see smaller things, like a hockey puck. If we can detect a puck, we can react to the puck hitting a virtual (drawn) hockey goal and play some celebratory party effect on the entire ice.

First approach:

- Read frame from camera
- Remove the background, everything that's not "fixed" in the scene.
- Find and track all the blobs.

![background removal](/docs/images/readme/nice_background_removal.webp)

The code for generating this example is here: [/modules/nice-camera/background_removal.py](/modules/nice-camera/background_removal.py).

For the background removal I originally made a simple routine that samples frames from a feed according to a timing strategy (like every x seconds), and then computes the over-time median color of all the pixels coordinates. Then we take the latest live frame and compute the delta by simply doing `current_frame - median_frame`, apply some filtering, and we're left with only the non-background pixels - like people moving on the ice. With the correct sample strategy this method also adapts to lighting changes due to clouds and time-of-day, or scene changes like a relatively static objects (a chair) being moved slightly.

Turns out that people have done good work on this topic, and now I use the built-in [background removal methods in OpenCV](https://docs.opencv.org/4.x/d1/dc5/tutorial_background_subtraction.html).

## Eureka!

With all this in place we can now trigger effects in the ice depending on where people are skating. This was completed two days before the temperature went way up and the ice started melting. Luckily I captured a few videos of it working - here's a sample:

![light reaction](/docs/images/readme/nice_light_reaction.webp)

Here you see a side-view, the view from the overhead camera, and then the ice-editor with a single virtual object (blue rectangle). The code that does the hit-detection and highlight effect is [here](/libs/nice-common/src/action/actionDirector.ts#L99).

### Please ignore the light

The blob detection approach currently uses image data (RGB) from the camera, and since light affects this image, a pixel change from lighting is no different than a change from a moving person. When lights are off or static (not moving) our approach works fine, but when they turn on and off, like when they're reacting to movement, then the change in lighting is just another change in the rgb data. It messes up the blob detection.

![light detection](/docs/images/readme/nice_blob_detection_lights.webp)

Notice how the detection picks up on the lights turning on and off in the ice.

Two possible ways to go:

- We know which lights we've turned on. Use this knowledge to render an approximation of what the current background (ice + lights) looks like right now, and then use that when detecting blobs. This should effectively ignore the change in lighting, and leave us with only the "true", non-light changes. This could be a viable approach, but it probably requires some pretty accurate light simulation and blending to get a good approximation of what the ice looks like at any given moment.
- Put an IR filter in front of the camera and run the blob detection only on IR data (not the visible spectrum). This seems like a roboust way to go as light from the LEDs would not affect the camera. Would probably require an [IR illuminator](https://www.amazon.com/IR-Illuminators/b?ie=UTF8&node=7161095011) for extra effect, but those are pretty cheap. Without having actually tried it yet, this solutions feels good. It's a practical, clean, engineering solution that should be much easier to implement than the complex lighting and image model that the first approach lays out.

Currently the thinking is to try out the IR approach, and I've bought IR filters that work on a wavelength of 850nm - the same wavelength that the camera built-in IR illuminator uses.

---

This old camera streaming and detection code is scattered across files in [this legacy folder](/old/nice-camera/src/), but it will probably all be ditched once we transition from using the puny visible light spectrum, to using the swanky IR spectrum.

### Camera

I'm using the [Reolink RLC-510A](https://reolink.com/product/rlc-510a/). I connect to the RTSP stream exposed by the camera using opencv, like this: `cv2.VideoCapture("rtsp://user:pass@192.168.10.177:554/h264Preview_01_main", cv2.CAP_FFMPEG)`.

Pros/cons:

- It has PoE (power over ethernet), which is very practical - just a single cable hanging out of the window...
- It can see IR and it has an IR illuminator built in. This enables the "night vision" feature. Unfortunately it's the IR-cut filter kind that doesn't allow a pure IR mode (no visible light), only a blending of the two.
- Decent resolution and image quality.
- Latency issues.

Like all(?) IP cameras, the latency is depressing. I tried different configs and setups, but even on a wired network the wave-your-hand to see-wave-in-camera time was never under a second. This dampens the reactive light-up skating experience, so I'll need find a better solution for this.

The code for the camera, both streaming object detection mode and the rgb mode, is [here](/old/nice-camera/src).

## Documentation

Ideas for docs are [here](/docs/devnotes.md).

## Future

Things for the next season.

- Implement IR approach to blob tracking.
- Enable simulating people and objects in the ice simulator. Like drawing in photoshop, except the pointer would be acting as a person gliding over the ice.
- Scriptable virtual ice objects. Example: A virtual hockey goal that explodes (light shoots out in all directions) when an object (puck) intersects with the goal rectangle.
- Clean up this repository. Remove all the legacy light and camera code.

Further todos and thinking (like game modes ideas) are [here](/docs/todo.md).
