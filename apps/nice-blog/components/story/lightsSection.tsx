import Grid from "@mui/material/Grid";
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
        Last year our Christmas tree donned 400 individually programmable
        lights, namely the wonderful{" "}
        <a
          href={
            "https://www.twinkly.com/products/strings-special-edition-400-leds/"
          }
        >
          Twinkly Special Edition LEDs
        </a>
        . A big hit with three-fourths of the household, these LEDs can be
        controlled with an app, festively unleashing all your creative powers in
        the pursuit of a classily lit Christmas tree 🎄 There are built-in
        animations, and the included power brick even includes a microphone
        allowing the lights to react to sounds, flashing bright with every
        ho-ho-ho detected. The lights are chained in two strands, and made for
        both indoor and outdoor use. Rated at IP44 {"they're"} {'"splash proof"'} and
        can withstand temperatures down to <Degrees degreesCelsius={-15} />.
      </StoryParagraph>

      <StoryParagraph>
        <Grid container={true}>
          <Grid xs={6} item={true}>
            text Here
            <br /> be <br /> stuff
          </Grid>
          <Grid xs={6} item={true}>
            <div>
              <video
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                }}
                src="story/tree_lights_classy.mp4"
                controls={false}
                muted={true}
                autoPlay={true}
                loop={true}
              />
            </div>
          </Grid>
        </Grid>
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

      <StoryParagraph>
        {"Here's"} a video showing the ice editor in use.
      </StoryParagraph>

      <StoryParagraph>
        {"Here's"} a video showing the ice editor in use.
      </StoryParagraph>
      <StoryBlock>
        <ReactPlayer url="story/nice_v5.mp4" controls={true} />
      </StoryBlock>

      <StoryBlock>
        <VirtualIceEditor />
      </StoryBlock>
    </section>
  );
};
