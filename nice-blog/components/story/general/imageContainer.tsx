import {
  createStyles,
  GridList,
  GridListTile,
  makeStyles,
  Theme,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import React from "react";

interface IImageContainerProps {
  /** Relative path to image */
  imgUrl: string;
}

const storyImagePath = "story/images";

export const SingleImageContainer: React.FunctionComponent<IImageContainerProps> = (
  props
) => {
  const { imgUrl } = props;
  const classes = useStyles();

  return (
    <Paper className={classes.root} variant="elevation" elevation={0}>
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

export const MultiImageContainer: React.FunctionComponent<IImageSetContainerProps> = (
  props
) => {
  const { imgUrls } = props;
  const classes = useStyles();

  return (
    <Paper className={classes.root} variant="elevation" elevation={0}>
      <GridList cellHeight={200} cols={imgUrls.length}>
        {imgUrls.map((imgUrl) => (
          <GridListTile key={imgUrl} cols={1}>
            <img
              src={`${storyImagePath}/${imgUrl}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </GridListTile>
        ))}
      </GridList>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
  })
);
