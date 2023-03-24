import ControlCamera from "@mui/icons-material/ControlCamera";
import LinearScale from "@mui/icons-material/LinearScale";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React from "react";
import { DrawMode } from "../models/drawContracts";

interface IDrawToolbarProps {
  mode: DrawMode;
  setMode(mode: DrawMode): void;
}

export const DrawToolbar: React.FunctionComponent<IDrawToolbarProps> = (
  props
) => {
  const handleMode = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: DrawMode | null
  ) => {
    if (newMode === null) return;
    props.setMode(newMode);
  };

  return (
    <ToggleButtonGroup
      value={props.mode}
      exclusive
      onChange={handleMode}
      aria-label="text alignment"
      size="small"
    >
      <ToggleButton value={DrawMode.Normal} aria-label="left aligned">
        <ControlCamera />
      </ToggleButton>
      <ToggleButton value={DrawMode.Drawing} aria-label="left aligned">
        <LinearScale />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
