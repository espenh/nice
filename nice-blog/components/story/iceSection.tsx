import React from "react";
import { ImageContainer } from "./general/imageContainer";
import { SectionHeader } from "./general/sectionHeader";

export const IceSection: React.FunctionComponent = () => {
  return (
    <section>
      <SectionHeader>Ice</SectionHeader>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id consectetur
        ipsa accusantium ab porro iure a aspernatur, in vero ipsam quis saepe
        minus odit, magni ullam. Quis vero aperiam laboriosam!
      </p>
      <ImageContainer imgUrl="PXL_20210218_182345934.MP.jpg" />
    </section>
  );
};
