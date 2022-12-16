import Box from "@mui/material/Box";
import { alpha } from "@mui/material";
import { staticLedMappingResult } from "@nice/nice-common";
import React, { useState } from "react";
import { useEditorHotkeys } from "../../hooks/useEditorHotkeys";
import { useEditorObjectState } from "../../hooks/useEditorObjectState";
import { DrawMode } from "../../models/drawContracts";
import { EditorSurface } from "./editorSurface";
import { ObjectProperties } from "./objectProperties";
import { DrawToolbar } from "./toolbar";

export const NiceEditor: React.FunctionComponent = () => {
  const [mode, setMode] = useState<DrawMode>(DrawMode.Normal);

  useEditorHotkeys();
  useEditorObjectState();

  return (
    <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
      <Box sx={{ zIndex: 1000, position: "absolute", bottom: 0, right: 0 }}>
        <ObjectProperties />
      </Box>
      <Box
        sx={{
          position: "absolute",
          backgroundColor: (theme) => alpha(theme.palette.grey[600], 0.2),
          backdropFilter: "blur(10px)",
          padding: (theme) => theme.spacing(1),
          zIndex: 1,
        }}
      >
        <DrawToolbar mode={mode} setMode={setMode} />
      </Box>
      <EditorSurface mode={mode} leds={staticLedMappingResult.foundLeds} />
    </Box>
  );
};
