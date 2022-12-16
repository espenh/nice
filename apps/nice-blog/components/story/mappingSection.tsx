import { VirtualIceEditor } from "@nice/nice-web-components";
import React from "react";
import ReactPlayer from "react-player";
import { MultiImageContainer } from "./general/imageContainer";
import { SectionHeader } from "./general/sectionHeader";
import { StoryBlock } from "./general/storyBlock";
import { StoryParagraph } from "./general/storyParagraph";

export const MappingSection: React.FunctionComponent = () => {
  return (
    <section>
      <SectionHeader>Mapping lights in 2D space</SectionHeader>
      <StoryParagraph>
        Since we want to control the LEDs based on their position on the ice, we
        need to know their 2D position in the frame captured by the camera. on
        the ice Using the Twinkly LED API, specific LEDs are addressed using
        their index - their position on the wire.
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
