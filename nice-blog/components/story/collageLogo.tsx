import { Typography, useTheme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React from "react";

export const CollageLogo: React.FunctionComponent = () => {
  const theme = useTheme();
  return (
    <Box position="relative">
      <Box
        height="500px"
        width="100%"
        bgcolor="black"
        color="white"
        fontSize="10rem"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          position: "relative",
        }}
      >
        <CollageSection
          url={"story/images/collagelogo/PXL_20210126_190031050.NIGHT.jpg"}
        />
        <CollageSection
          url={"story/images/collagelogo/PXL_20210213_125747126.jpg"}
        />
        <CollageSection
          url={"story/images/collagelogo/PXL_20210131_094259474.jpg"}
        />
        {/*<CollageSection url={"story/images/collagelogo/PXL_20210218_182345934.MP.jpg"} />*/}
        <Box height="100%" minHeight="0" position="relative">
          <video
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            playsInline={true}
            muted={true}
            autoPlay={true}
            loop={true}
            src="/story/test_short_1_medium.mp4"
          />
        </Box>
      </Box>
      <Box position="absolute" bottom="0">
        <Typography style={{ fontSize: "15rem", color: "white" }}>nice</Typography>
      </Box>
    </Box>
  );
};

export const CollageSection: React.FunctionComponent<{ url: string }> = ({
  url,
}) => {
  return (
    <Box height="100%" minHeight="0" position="relative">
      <img
        src={url}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>
  );
};
