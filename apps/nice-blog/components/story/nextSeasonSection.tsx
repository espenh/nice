import React from "react";
import { SectionHeader } from "./general/sectionHeader";
import { StoryParagraph } from "./general/storyParagraph";

export const NextSeasonSection: React.FunctionComponent = () => {
  return (
    <section>
      <SectionHeader>Next season!</SectionHeader>
      <StoryParagraph>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id consectetur
        ipsa accusantium ab porro iure a aspernatur, in vero ipsam quis saepe
        minus odit, magni ullam. Quis vero aperiam laboriosam!
      </StoryParagraph>
    </section>
  );
};
