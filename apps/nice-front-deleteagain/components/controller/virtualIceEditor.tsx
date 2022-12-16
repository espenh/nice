import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import {
  ActionDirector,
  ColorsByIndex,
  getActionDirectorMessageHandler,
  ILightsClient,
  staticLedMappingResult,
  staticLedStatus,
} from "@nice/nice-common-delete";
import React, { useMemo, useState } from "react";
import { ActionConnectionProvider } from "../contexts/actionConnectionContext";
import { FabricContextProvider } from "../contexts/fabricContext";
import { NiceEditor } from "./niceEditor";
import { VirtualIce } from "./virtualIce";

export const VirtualIceEditor: React.FunctionComponent = () => {
  const [colors, setColors] = useState<ColorsByIndex>({});

  const actionHandler = useMemo(() => {
    const fakeLightClient: ILightsClient = {
      turnOnLights(colorsByIndex: ColorsByIndex): Promise<void> {
        setColors(colorsByIndex);
        return Promise.resolve();
      },
    };

    const actionDirector = new ActionDirector(
      staticLedStatus,
      fakeLightClient,
      () => new Date().valueOf()
    );

    return getActionDirectorMessageHandler(actionDirector);
  }, []);

  return (
    <ActionConnectionProvider messageHandler={actionHandler}>
      <FabricContextProvider>
        <Container>
          <Box
            width={"100%"}
            height={"100%"}
            sx={{
              display: "grid",
              gridTemplateColumns: `1fr 1fr`,
              gridAutoRows: "1fr",
              gap: (theme) => theme.spacing(1),
              padding: (theme) => theme.spacing(1),
              minHeight: "400px",
              //backgroundColor: theme.palette.grey[600],
            }}
            alignContent="center"
          >
            <Paper square={true} elevation={4} style={{ minWidth: 0 }}>
              <NiceEditor />
            </Paper>
            <Paper square={true} elevation={4}>
              <VirtualIce
                ledStatus={{ leds: staticLedMappingResult.foundLeds }}
                colorsByIndex={colors}
              />
            </Paper>
          </Box>
        </Container>
      </FabricContextProvider>
    </ActionConnectionProvider>
  );
};
