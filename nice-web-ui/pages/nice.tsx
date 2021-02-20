import { Container, NoSsr } from "@material-ui/core";
import React from "react";
import { NiceEditor } from "../components/niceEditor";
import { ActionConnectionProvider } from "../context/actionConnectionContext";
import { FabricContextProvider } from "../context/fabricContext";

export const NicePage: React.FunctionComponent = () => {
  return (
    <NoSsr>
      <ActionConnectionProvider>
        <FabricContextProvider>
          <Container className="container">
            <NiceEditor />
          </Container>
        </FabricContextProvider>
      </ActionConnectionProvider>
    </NoSsr>
  );
};

export default NicePage;
