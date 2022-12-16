import { createStyles, fade, makeStyles, Theme } from "@material-ui/core";
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
  const classes = useStyles();

  useEditorHotkeys();
  useEditorObjectState();

  return (
    <div className={classes.toolsAndSurface}>
      <div className={classes.toolbar}>
        <ObjectProperties />
        <DrawToolbar mode={mode} setMode={setMode} />
      </div>
      <EditorSurface mode={mode} leds={mappingResult.foundLeds} />
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    toolbar: {
      position: "fixed",
      backgroundColor: fade(theme.palette.grey[600], 0.2),
      backdropFilter: "blur(10px)",
      padding: theme.spacing(1),
      zIndex: 1,
    },
    toolsAndSurface: {
      height: "100%",
      width: "100%",
      position: "relative",
    },
  })
);
