
import Box from "@mui/material/Box";
import React from "react";

export const CollageLogo: React.FunctionComponent = () => {
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
          url={"story/images/collagelogo/PXL_20210331_114202770.PORTRAIT.jpg"}
        />
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
