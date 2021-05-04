import Link from "@material-ui/core/Link";
import React from "react";
import ReactPlayer from "react-player";
import { VirtualIceEditor } from "../controller/virtualIceEditor";
import { Degrees } from "./general/degrees";
import { MultiImageContainer } from "./general/imageContainer";
import { SectionHeader } from "./general/sectionHeader";
import { StoryBlock } from "./general/storyBlock";
import { StoryParagraph } from "./general/storyParagraph";

export const LightsSection: React.FunctionComponent = () => {
  return (
    <section>
      <SectionHeader>Lights</SectionHeader>
      <StoryParagraph>
        Last year our Christmas tree donned 400 individually programmable lights, specifically the wonderful <a
          href={
            "https://www.twinkly.com/products/strings-special-edition-400-leds/"
          }
        >
          Twinkly Special Edition LEDs
        </a>. A big hit with three-fourths of the household, these LEDs can be configured using an app to form thousands of equally classy Holiday themes. You can also use animations, built-in or custom, and these endlessly loop  LEDs. The included power brick even includes a microphone allowing the lights to react to sounds, flashing brightly with every ho-ho-ho detected.
        They're chained in two strands, 400 LEDs in total, programmable using
        the Twinkly app. The LEDs are made for both indoor and outdoor use,
        rated IP44 (splash proof) and can withstand temperatures down to
        <Degrees degreesCelsius={-15} />.

      </StoryParagraph>
      <StoryParagraph>
        The lights were a big success with three-fourths of the household, and
      </StoryParagraph>

      <StoryBlock>
        <MultiImageContainer
          imgUrls={[
            "PXL_20210218_182345934.MP.jpg",
            "PXL_20210218_182345934.MP.jpg",
            "PXL_20210218_182345934.MP.jpg",
            "PXL_20210218_182345934.MP.jpg",
            "PXL_20210218_182345934.MP.jpg",
          ]}
        />
      </StoryBlock>

      <StoryBlock>
        <VirtualIceEditor />
      </StoryBlock>

      <StoryBlock>
        <ReactPlayer url="story/nice_v5.mp4" controls={true} />
      </StoryBlock>
    </section>
  );
};
