import React from "react";
import ReactPlayer from "react-player";
import { VirtualIceEditor } from "../controller/virtualIceEditor";
import { MultiImageContainer } from "./general/imageContainer";
import { SectionHeader } from "./general/sectionHeader";
import { StoryBlock } from "./general/storyBlock";
import { StoryParagraph } from "./general/storyParagraph";

export const LightsSection: React.FunctionComponent = () => {
  return (
    <section>
      <SectionHeader>Lights</SectionHeader>
      <StoryParagraph>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id consectetur
        ipsa accusantium ab porro iure a aspernatur, in vero ipsam quis saepe
        minus odit, magni ullam. Quis vero aperiam laboriosam!
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
