import { Grid } from "@material-ui/core";
import React from "react";
import { MultiImageContainer } from "./general/imageContainer";
import { SectionHeader } from "./general/sectionHeader";
import { StoryParagraph } from "./general/storyParagraph";

export const IceSection: React.FunctionComponent = () => {
  return (
    <section>
      <SectionHeader>Ice</SectionHeader>
      <StoryParagraph>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id consectetur
        ipsa accusantium ab porro iure a aspernatur, in vero ipsam quis saepe
        minus odit, magni ullam. Quis vero aperiam laboriosam!
      </StoryParagraph>

      <MultiImageContainer
        imgUrls={[
          "PXL_20210126_190031050.NIGHT.jpg",
          "PXL_20210127_075119456.jpg",
          "PXL_20210128_181411042.NIGHT.jpg",
          "PXL_20210129_165853601.NIGHT.jpg",
        ]}
      />

      <StoryParagraph>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias,
        sint! Corporis quae ea iure, eum animi a labore dolore fuga aliquam
        soluta maxime dicta ratione quos. Maxime rem aliquam cupiditate.
      </StoryParagraph>

      <Grid container spacing={3}>
        <Grid item={true} xs={8}>
          <StoryParagraph>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique,
            accusantium voluptas voluptatem, corrupti in iusto odit voluptates
            dolores repellendus eius saepe fugit sint ratione veniam labore quo
            est pariatur. At?
          </StoryParagraph>
        </Grid>
        <Grid item={true} xs={4}>
          <MultiImageContainer
            imgUrls={[
              "PXL_20210205_185253335.NIGHT.jpg",
              "PXL_20210205_185319589.NIGHT.jpg",
            ]}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item={true} xs={8}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 300 24"
          >
            <text textLength="290" lengthAdjust="spacing" x="5" y="14">
              WATER + COLD
            </text>
          </svg>
        </Grid>
        <Grid item={true} xs={4}>
          <MultiImageContainer
            imgUrls={[
              "PXL_20210205_185253335.NIGHT.jpg",
              "PXL_20210205_185319589.NIGHT.jpg",
            ]}
          />
        </Grid>
      </Grid>

      <StoryParagraph>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut nobis,
        provident alias cum numquam nam. Blanditiis hic voluptatibus, dolores
        iure dolorum quibusdam culpa commodi aliquid voluptatem quae delectus
        molestias cum?
      </StoryParagraph>
    </section>
  );
};
