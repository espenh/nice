import Typography from "@mui/material/Typography";
import React from "react";

export const StoryParagraph: React.FunctionComponent<
  React.PropsWithChildren
> = (props) => {
  const { children } = props;
  return <Typography paragraph={true}>{children}</Typography>;
};
