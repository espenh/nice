import { useTheme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React from "react";

export const VideoLogo: React.FunctionComponent = () => {
  const theme = useTheme();
  return (
    <Box
      height="500px"
      width="100%"
      bgcolor="black"
      color="white"
      fontSize="10rem"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        position: "relative",
      }}
    >
      <Box>hey</Box>
      <Box height="100%" minHeight="0" position="relative">
        <video
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          playsInline={true}
          muted={true}
          autoPlay={true}
          loop={true}
          src="/story/Snapchat-1856402479_2.mp4"
        />
      </Box>
    </Box>
  );
};
