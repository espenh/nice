import React from "react";
import { SectionHeader } from "./general/sectionHeader";
import { StoryParagraph } from "./general/storyParagraph";

export const CodeInfoSection: React.FunctionComponent = () => {
  return (
    <section>
      <SectionHeader>Code</SectionHeader>
      <StoryParagraph>
        All the code this project is available on
        <a href="https://github.com/espenh/nice">GitHub</a>.
      </StoryParagraph>
    </section>
  );
};
