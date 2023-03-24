import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Paper from "@mui/material/Paper";
import React from "react";

interface IImageContainerProps {
  /** Relative path to image */
  imgUrl: string;
}

const storyImagePath = "story/images";

export const SingleImageContainer: React.FunctionComponent<
  IImageContainerProps
> = (props) => {
  const { imgUrl } = props;

  return (
    <Paper
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
      variant="elevation"
      elevation={0}
    >
      <img
        src={`${storyImagePath}/${imgUrl}`}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Paper>
  );
};

interface IImageSetContainerProps {
  /** Relative path to image */
  imgUrls: string[];
}

export const MultiImageContainer: React.FunctionComponent<
  IImageSetContainerProps
> = (props) => {
  const { imgUrls } = props;

  return (
    <Paper
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
      variant="elevation"
      elevation={0}
    >
      <ImageList rowHeight={200} cols={imgUrls.length}>
        {imgUrls.map((imgUrl) => (
          <ImageListItem key={imgUrl} cols={1}>
            <img
              src={`${storyImagePath}/${imgUrl}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Paper>
  );
};
