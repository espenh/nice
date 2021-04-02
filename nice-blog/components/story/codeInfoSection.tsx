import React from "react";
import { SectionHeader } from "./general/sectionHeader";
import { StoryParagraph } from "./general/storyParagraph";

export const CodeInfoSection: React.FunctionComponent = () => {
  return (
    <section>
      <SectionHeader>Code</SectionHeader>
      <StoryParagraph>GitHub etc.</StoryParagraph>
    </section>
  );
};
