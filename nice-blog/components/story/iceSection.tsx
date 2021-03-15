import _ from "lodash";
import React from "react";
import { ImageContainer, ImageSetContainer } from "./general/imageContainer";
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
      <ImageSetContainer imgUrls={["PXL_20210218_182345934.MP.jpg", "PXL_20210218_182345934.MP.jpg", "PXL_20210218_182345934.MP.jpg", "PXL_20210218_182345934.MP.jpg", "PXL_20210218_182345934.MP.jpg", "PXL_20210218_182345934.MP.jpg"]} />
      <ImageContainer imgUrl="PXL_20210218_182345934.MP.jpg" />
    </section>
  );
};
