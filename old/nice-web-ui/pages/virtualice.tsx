import {
  Container,
  createStyles,
  makeStyles,
  NoSsr,
  Paper,
  Theme,
} from "@material-ui/core";
import Box from "@mui/material/Box";
import {
  ActionDirector,
  ColorsByIndex,
  getActionDirectorMessageHandler,
  ILightsClient,
  staticLedMappingResult,
  staticLedStatus,
} from "nice-common";
import React, { useMemo, useState } from "react";
import { NiceEditor } from "../components/niceEditor";
import { VirtualIce } from "../components/virtualIce";
import { ActionConnectionProvider } from "../context/actionConnectionContext";
import { FabricContextProvider } from "../context/fabricContext";

export const VirtualIcePage: React.FunctionComponent = () => {
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
    <NoSsr>
      <ActionConnectionProvider messageHandler={actionHandler}>
        <FabricContextProvider>
          <Container>
            <Box width={800} height={400} className={classes.editorAndIce}>
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

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    editorAndIce: {
      display: "grid",
      gridTemplateColumns: `1fr 1fr`,
      background: "conic-gradient(at top right, lightcyan, lightblue)",
      gap: theme.spacing(1),
      padding: theme.spacing(1),
      //backgroundColor: theme.palette.grey[600],
    },
  })
);

export default VirtualIcePage;
