import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import React, { PropsWithChildren } from "react";
import { CameraSection } from "./cameraSection";
import { CodeInfoSection } from "./codeInfoSection";
import { CollageLogo } from "./collageLogo";
import { IceSection } from "./iceSection";
import { IntroSection } from "./introSection";
import { LightsSection } from "./lightsSection";
import { NextSeasonSection } from "./nextSeasonSection";
import { TrackingSection } from "./trackingSection";

export const Story: React.FunctionComponent = () => {
  return (
    <Box>
      <Typography variant="h1">Nice</Typography>
      <CollageLogo />
      <IntroSection />
      <LightsSection />
      <IceSection />
      <CameraSection />
      <TrackingSection />
      <NextSeasonSection />
      <CodeInfoSection />
    </Box>
  );
};

export const FullWidth: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return <Box marginX={(theme) => -theme.spacing(0.4)}>{children}</Box>;
};
