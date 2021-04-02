import Box from "@material-ui/core/Box";
import React from "react";

export const StoryBlock: React.FunctionComponent<
  React.PropsWithChildren<{}>
> = (props) => {
  const { children } = props;
  return (
    <Box mb={2} mt={2}>
      {children}
    </Box>
  );
};
