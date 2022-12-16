import Grid from "@mui/material/Grid";
import React from "react";
import { MultiImageContainer } from "./general/imageContainer";
import { SectionHeader } from "./general/sectionHeader";
import { StoryParagraph } from "./general/storyParagraph";

export const IceSection: React.FunctionComponent = () => {
  return (
    <section>
      <SectionHeader>Ice</SectionHeader>
      <StoryParagraph>
        With a new-found interest ice skating, and a weather forecast showing
        two weeks of freezing temperatures, we started prepping for a home made
        ice rink. We read up on homemade ice rinks online, and while most were
        made using some sort of wooden framing plus a huge tarp that held the
        water, some people made the ice directly on snow. The trick is
        apparently to cover the snow with thin layers of water, steadily
        building up the ice thickness. This is supposedly more gentle on the
        grass, since the layer of snow acts as some kind of breathing insulation
        against the ice. It could just be propaganda from the no-tarp lobby, but
        our grass came out just fine using this approach.
      </StoryParagraph>
      <StoryParagraph>
        The only realistic location for an ice rink in our garden has a slight
        slant, so we used snow to build up a somewhat level surface. Then we
        showered the snow with water, being careful to only use the fine spray
        setting on the nozzle. Once a layer of ice started forming we gradually
        ramped up and started throwing more and more using a hose + buckets.
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

      <StoryParagraph>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut nobis,
        provident alias cum numquam nam. Blanditiis hic voluptatibus, dolores
        iure dolorum quibusdam culpa commodi aliquid voluptatem quae delectus
        molestias cum?
      </StoryParagraph>
    </section>
  );
};
