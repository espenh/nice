import { Box } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import React, { useState } from "react";
import { useEditorHotkeys } from "../hooks/useEditorHotkeys";
import { useEditorObjectState } from "../hooks/useEditorObjectState";
import { mappingResult } from "../model/basline";
import { DrawMode } from "../model/drawContracts";
import { EditorSurface } from "./editorSurface";
import { ObjectProperties } from "./objectProperties";
import { DrawToolbar } from "./toolbar";

export const NiceEditor: React.FunctionComponent = () => {
  const [mode, setMode] = useState<DrawMode>(DrawMode.Normal);
  useEditorHotkeys();
  useEditorObjectState();

  return (
    <Box className="app">
      <Box m={1}>
        <ObjectProperties />
        <DrawToolbar mode={mode} setMode={setMode} />
      </Box>
      <Box m={1}>
        <Paper>
          <EditorSurface mode={mode} leds={mappingResult.foundLeds} />
        </Paper>
      </Box>

      <style jsx global>{`
        canvas {
          //transform: scale(0.5);
          //transform-origin: 0 0;
          width: 100%;
          height: 100%;
        }

        .app {
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-rows: auto 1fr;
        }

        .app > * {
          min-width: 0;
        }

        .canvas-wrapper {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </Box>
  );
};
