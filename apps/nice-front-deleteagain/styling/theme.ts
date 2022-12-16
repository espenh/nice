import { createTheme, ThemeOptions } from "@mui/material/styles";

const defaults: ThemeOptions = {
  palette: {
    mode: "light",
  },
};

// Create a theme instance.
const theme = createTheme(defaults);

export default theme;
