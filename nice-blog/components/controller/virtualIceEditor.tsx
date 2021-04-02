import {
  Container,
  createStyles,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {
  ActionDirector,
  ColorsByIndex,
  getActionDirectorMessageHandler,
  ILightsClient,
  staticLedMappingResult,
  staticLedStatus,
} from "nice-common";
import React, { useMemo, useState } from "react";
import { ActionConnectionProvider } from "../contexts/actionConnectionContext";
import { FabricContextProvider } from "../contexts/fabricContext";
import { NiceEditor } from "./niceEditor";
import { VirtualIce } from "./virtualIce";

export const VirtualIceEditor: React.FunctionComponent = () => {
  const classes = useStyles();
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
          <Box width={1024} height={400} className={classes.editorAndIce}>
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
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    editorAndIce: {
      display: "grid",
      gridTemplateColumns: `1fr 1fr`,
      gap: theme.spacing(1),
      padding: theme.spacing(1),
      //backgroundColor: theme.palette.grey[600],
    },
  })
);
