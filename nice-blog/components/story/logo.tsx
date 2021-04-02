import { Typography } from "@material-ui/core";
import React from "react";

export const Logo: React.FunctionComponent = () => {
  return (
    <header>
      <Typography
        style={{
          backgroundImage: "url(nice_logo.jpg)",
          backgroundClip: "text",
          color: "transparent",
          WebkitBackgroundClip: "text",
          fontWeight: 900,
          fontSize: "4em",
          fontFamily:
            "Segoe UI,Frutiger,Frutiger Linotype,Dejavu Sans,Helvetica Neue,Arial,sans-serif",
        }}
      >
        NICE
      </Typography>
    </header>
  );
};
