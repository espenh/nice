import { NoSsr } from "@mui/material";
import { VirtualIceEditor } from "@nice/nice-web-components";
import React from "react";

export const NicePage: React.FunctionComponent = () => {
  return (
    <NoSsr>
      <NicePageContents />
    </NoSsr>
  );
};

const NicePageContents: React.FunctionComponent = () => {
  return <VirtualIceEditor />;
};

export default NicePage;
