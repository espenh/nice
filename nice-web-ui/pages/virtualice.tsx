import { staticLedMappingResult } from "nice-common";
import { Container, NoSsr } from "@material-ui/core";
import React from "react";
import { VirtualIce } from "../components/virtualIce";
import { ActionConnectionProvider } from "../context/actionConnectionContext";
import { FabricContextProvider } from "../context/fabricContext";
import Box from "@material-ui/core/Box";

export const VirtualIcePage: React.FunctionComponent = () => {
  return (
    <NoSsr>
      <ActionConnectionProvider>
        <FabricContextProvider>
          <Container>
            <Box width={600} height={400}>
              <VirtualIce
                ledsStatu={{ leds: staticLedMappingResult.foundLeds }}
              />
            </Box>
          </Container>
        </FabricContextProvider>
      </ActionConnectionProvider>
    </NoSsr>
  );
};

export default VirtualIcePage;
