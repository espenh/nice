import { withStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";

export const FillingBox = withStyles({
  root: {
    width: "100%",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
})(Box);
