import React from "react";

export const SectionHeader: React.FunctionComponent<
  React.PropsWithChildren<{}>
> = (props) => {
  return <h3>{props.children}</h3>;
};
