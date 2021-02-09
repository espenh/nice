import { GetServerSideProps } from "next";
import React from "react";
import { BasicFabric } from "../components/basicFabric";
import { mappingResult } from "../model/basline";

interface IBasicPageSSRProps {
  hey: "no";
}

export const BasicPage: React.FunctionComponent<IBasicPageSSRProps> = () => {
  return (
    <div>
      <BasicFabric leds={mappingResult.foundLeds} />
    </div>
  );
};

export default BasicPage;
