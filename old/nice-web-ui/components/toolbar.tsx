import LinearScale from "@mui/icons-material/LinearScale";
import ControlCamera from "@mui/icons-material/ControlCamera";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React from "react";
import { DrawMode } from "../model/drawContracts";

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
