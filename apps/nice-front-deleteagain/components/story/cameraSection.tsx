import React from "react";
import { Degrees } from "./general/degrees";
import { SectionHeader } from "./general/sectionHeader";
import { StoryParagraph } from "./general/storyParagraph";

export const CameraSection: React.FunctionComponent = () => {
  return (
    <section>
      <SectionHeader>Camera</SectionHeader>
      <StoryParagraph>
        I first considered just taping a webcam to the top of a window
        overlooking the ice, but the angle was awkward and there were glare
        issues so I started looking at outdoor cameras. It would need to
        withstand temperatures down to <Degrees degreesCelsius={-10} />, and
        preferably have as low latency as possible. The time from
        movement-on-ice to movement-detected-in-captured-frame is critical,
        since anything high here would really cheapen the experience. This
        latency requirement ruled out a bunch of home security cameras as they
        typically connect to the cloud, and I {"didn't"} want to add the latency of
        streaming from some server.
      </StoryParagraph>

      <StoryParagraph>
        After a couple hours of quick research I went for the
        <a href="https://reolink.com/product/rlc-510a/">
          Reolink RLC-510A IP camera
        </a>
        . This seems like a really nice camera if {"you're"} into surveilance. {"It's"}
        pretty cheap, has a bunch of features, and surprisingly good image
        quality. It also has a night vision mode using IR, and I thought this
        could come in handy in low-light when the LEDs in the ice have the
        greatest visual effect. Having little experience with IP cameras I
        thought streaming video from camera on a wired network would be near
        real time, but it turned out to have a latency of between 0.5 and 3
        seconds depending on stream configuration. In the advanced section of
        the camera software there are encoding options available, like which
        H264 profile to use, noise reduction settings etc. and these affect the
        latency, but no tweaking got me lower than about half a second. Looking
        online it seems like this actually quite good for an IP camera, so I
        {"didn't"} spend any more time on it.
      </StoryParagraph>
      <StoryParagraph>
        If {"you're"} interested in more internal details about these cameras,
        <a href="https://www.thirtythreeforty.net/posts/2020/05/hacking-reolink-cameras-for-fun-and-profit/">
          {"here's"} a guy that really goes to town on a similar camera
        </a>
        .
      </StoryParagraph>
    </section>
  );
};
