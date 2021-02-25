# Todo and thoughts

Parameters and constants are derived from tweaking based on current settings (camera position, led ice depth, time of day etc.). Having a way to calibrate and test while on a live feed would be awesome.

- Calibrate everything in camera view
  - size of objects
  - opencv parameters like thresholds
  - led glare size
  - ignore patterns, interaction cool down etc.

Experiment with physics engine (box2d, cannon, matterjs) to have physics based effects.

- Collisions, moving and static objects, virtual and real. Example: puck hitting a real or virtual goal.
- These engines usually have collision hooks that provide good stuff like impact velocity etc. that can shape the resulting effect.
- It could be that this would alleviate some issues around tracking moving objects. A janky stream of moving objects data could be "fixed" in-engine, and as a result collisions could fire event if the position data indicate that a real object went through a virtual one (example: Frame 10 puck is in front of virtual goal, frame 11 puck is behind virtual goal - seemingly no collision).

Find a good approach to not categorizing led activity as movement. We only want real objects.

- Current approach with exclusion zones (ignore positions where we have ongoing led effects) could be improved, but will always be a bit of a hack.

Look into other tracking methods

- Could we track objects in a strict way (shape, size) and then only care about those objects? Any new object would need to enter from the boundaries of the scene.

## Modes

Feels like there's lot's of potential for different game modes here.

- Draw up virtual hockey goals.
- Draw helping indicator line between actual shoes on ice (poor man's goals)
- Swap modes by signaling using body. Example: Two big over-head claps could trigger a different game mode.
- In "hockey" mode, current score by indicating with dots next to goal. Single-led could be a bit small here, so use different colors for each dot (goal).
- In "obstacle course" mode-
  - Highlight current target. The current target could also dim (or shrink) to indicate time left.
  - Show shadow of best attempt (shadow).
- Skater trace. Show a trace behind moving objects on ice. Could be customizable (color, effect, length).
- Virtual puck. Probably very difficult to do accurately, but could be a fun experiment. Maybe it could be a coarse rocket league type interaction with a huge puck. Collision hazard with one puck? Could have a puck for each team.
- Momentum effects. Track skaters and create effects for movement that create a certain g-force. Example: Stopping abtruptly or quickly changing direction could create a short-lived orange "wave" in the original direction.
-
