import React from "react";
import { Tooltip } from "@material-ui/core";

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
