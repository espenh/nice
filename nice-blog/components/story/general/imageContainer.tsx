import { createStyles, GridList, GridListTile, makeStyles, Theme } from "@material-ui/core";
import React from "react";

interface IImageContainerProps {
  /** Relative path to image */
  imgUrl: string;
}

const storyImagePath = "story/images";

export const ImageContainer: React.FunctionComponent<IImageContainerProps> = (
  props
) => {
  const { imgUrl } = props;
  return <img src={`${storyImagePath}/${imgUrl}`} />;
};

interface IImageSetContainerProps {
  /** Relative path to image */
  imgUrls: string[];
}

export const ImageSetContainer: React.FunctionComponent<IImageSetContainerProps> = (
  props
) => {
  const { imgUrls } = props;
  const classes = useStyles();

  return <GridList cellHeight={160} className={classes.gridList} cols={3}>
    {imgUrls.map((imgUrl) => (
      <GridListTile key={imgUrl} cols={3 || 1}>
        <img src={`${storyImagePath}/${imgUrl}`} />
      </GridListTile>
    ))}
  </GridList>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 500,
      height: 450,
    },
  }),
);