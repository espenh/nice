import Tooltip from "@mui/material/Tooltip";
import React from "react";

export const Degrees: React.FunctionComponent<{
  degreesCelsius: number;
}> = ({ degreesCelsius }) => {
  const degreesFahrenheit = degreesCelsius * 1.8 + 32;
  return (
    <Tooltip title={`${degreesFahrenheit}°F`}>
      <span>{degreesCelsius}°C</span>
    </Tooltip>
  );
};
