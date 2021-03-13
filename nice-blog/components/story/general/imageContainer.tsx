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
