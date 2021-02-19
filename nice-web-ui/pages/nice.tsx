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
            <style jsx global>{`
              html,
              body {
                padding: 0;
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                  Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
                  Helvetica Neue, sans-serif;
              }

              * {
                box-sizing: border-box;
              }

              .container {
                width: 100vw;
                height: 100vh;
              }
            `}</style>
            <NiceEditor />
          </Container>
        </FabricContextProvider>
      </ActionConnectionProvider>
    </NoSsr>
  );
};

export default NicePage;
