import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import NoSsr from "@mui/material/NoSsr";
import Paper from "@mui/material/Paper";
import {
  ActionDirector,
  ColorsByIndex,
  getActionDirectorMessageHandler,
  ILightsClient,
  staticLedMappingResult,
  staticLedStatus,
} from "@nice/nice-common";
import {
  ActionConnectionProvider,
  FabricContextProvider,
  NiceEditor,
  VirtualIce,
} from "@nice/nice-web-components";
import React, { useMemo, useState } from "react";

export const VirtualIcePage: React.FunctionComponent = () => {
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
    <NoSsr>
      <ActionConnectionProvider messageHandler={actionHandler}>
        <FabricContextProvider>
          <Container>
            <Box
              width={800}
              height={400}
              sx={{
                display: "grid",
                gridTemplateColumns: `1fr 1fr`,
                background:
                  "conic-gradient(at top right, lightcyan, lightblue)",
                gap: (theme) => theme.spacing(1),
                padding: (theme) => theme.spacing(1),
                //backgroundColor: theme.palette.grey[600],
              }}
            >
              <Paper square={true} elevation={4}>
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
    </NoSsr>
  );
};

export default VirtualIcePage;
