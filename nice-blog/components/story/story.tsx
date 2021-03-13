import type React from "react";
import { CameraSection } from "./cameraSection";
import { CodeInfoSection } from "./codeInfoSection";
import { IceSection } from "./iceSection";
import { IntroSection } from "./introSection";
import { LightsSection } from "./lightsSection";
import { Logo } from "./logo";
import { NextSeasonSection } from "./nextSeasonSection";
import { TrackingSection } from "./trackingSection";

export const Story: React.FunctionComponent = () => {
  return (
    <main>
      <Logo />
      <IntroSection />
      <IceSection />
      <LightsSection />
      <CameraSection />
      <TrackingSection />
      <NextSeasonSection />
      <CodeInfoSection />
    </main>
  );
};
