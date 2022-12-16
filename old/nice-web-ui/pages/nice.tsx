import { Container, NoSsr } from "@material-ui/core";
import Box from "@mui/material/Box";
import React from "react";
import { NiceEditor } from "../components/niceEditor";
import { ActionConnectionProvider } from "../context/actionConnectionContext";
import { FabricContextProvider } from "../context/fabricContext";
import { getOrCreateSocketBasedSender } from "../modules/actionMessageWebSocket";

export const NicePage: React.FunctionComponent = () => {
  return (
    <NoSsr>
      <NicePageContents />
    </NoSsr>
  );
};

const NicePageContents: React.FunctionComponent = () => {
  const actionHandler = getOrCreateSocketBasedSender();
  return (
    <ActionConnectionProvider messageHandler={actionHandler}>
      <FabricContextProvider>
        <Container>
          <Box width="100%" height="600px">
            <NiceEditor />
          </Box>
        </Container>
      </FabricContextProvider>
    </ActionConnectionProvider>
  );
};

export default NicePage;
