import Box from "@mui/material/Box";
import { PropsWithChildren } from "react";

export const FillingBox: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <Box sx={{ width: "100%", height: "100%", minHeight: 0, minWidth: 0 }}>
      {children}
    </Box>
  );
};
