import Typography from "@mui/material/Typography";
import React from "react";

export const SectionHeader: React.FunctionComponent<React.PropsWithChildren> = (
  props
) => {
  return (
    <Typography variant="h5" gutterBottom={true}>
      {props.children}
    </Typography>
  );
};
