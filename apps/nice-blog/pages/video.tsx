import React from "react";
import ReactPlayer from "react-player";

export default function Vision() {
  return (
    <>
      <Internal />
    </>
  );
}

const Internal: React.FunctionComponent = () => {
  return (
    <div>
      <ReactPlayer
        url="/videos/vision/sample_day_real_1.mp4"
        height={200}
        width={400}
        loop={true}
        playing={true}
      ></ReactPlayer>
    </div>
  );
};
