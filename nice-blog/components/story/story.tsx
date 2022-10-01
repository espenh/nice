import { Typography, useTheme } from "@material-ui/core";
import Box from "@material-ui/core/Box";

import type React from "react";
import { CameraSection } from "./cameraSection";
import { CodeInfoSection } from "./codeInfoSection";
import { CollageLogo } from "./collageLogo";
import { IceSection } from "./iceSection";
import { IntroSection } from "./introSection";
import { LightsSection } from "./lightsSection";
import { Logo } from "./logo";
import { NextSeasonSection } from "./nextSeasonSection";
import { TrackingSection } from "./trackingSection";
import { VideoLogo } from "./videoLogo";

export const Story: React.FunctionComponent = () => {
  return (
    <main>
      <Typography variant="h1">Nice</Typography>
      <CollageLogo />
      <IntroSection />
      <LightsSection />
      <IceSection />
      <CameraSection />
      <TrackingSection />
      <NextSeasonSection />
      <CodeInfoSection />
    </main>
  );
};

export const FullWidth: React.FunctionComponent = (props) => {
  const theme = useTheme();
  return <Box marginX={-theme.spacing(0.4)}>{props.children}</Box>;
};
