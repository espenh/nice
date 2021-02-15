import { Box } from "@material-ui/core";
import React, { useState } from "react";
import { useEditorHotkeys } from "../hooks/useEditorHotkeys";
import { useEditorObjectState } from "../hooks/useEditorObjectState";
import { mappingResult } from "../model/basline";
import { DrawMode } from "../model/drawContracts";
import { EditorSurface } from "./editorSurface";
import { DrawToolbar } from "./toolbar";

export const NiceEditor: React.FunctionComponent = () => {
  const [mode, setMode] = useState<DrawMode>(DrawMode.Normal);
  useEditorHotkeys();
  useEditorObjectState();

  return (
    <Box className="app">
      <Box>
        <DrawToolbar mode={mode} setMode={setMode} />
      </Box>
      <Box>
        <EditorSurface mode={mode} leds={mappingResult.foundLeds} />
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

        .canvas-wrapper {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </Box>
  );
};
