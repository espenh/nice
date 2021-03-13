import React from "react";
import ReactPlayer from "react-player";

export const LightsSection: React.FunctionComponent = () => {
  return (
    <section>
      <h3>Lights</h3>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id consectetur
        ipsa accusantium ab porro iure a aspernatur, in vero ipsam quis saepe
        minus odit, magni ullam. Quis vero aperiam laboriosam!
      </p>
      <ReactPlayer url="story/nice_v5.mp4" controls={true} />
    </section>
  );
};
