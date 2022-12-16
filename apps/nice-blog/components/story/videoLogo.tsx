import Box from "@mui/material/Box";
import React from "react";

export const VideoLogo: React.FunctionComponent = () => {
  return (
    <Box
      height="500px"
      width="100%"
      bgcolor="black"
      color="white"
      fontSize="10rem"
      sx={{
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
