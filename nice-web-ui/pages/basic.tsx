import { GetServerSideProps } from "next";
import React from "react";
import { BasicFabric } from "../components/basicFabric";
import { mappingResult } from "../model/basline";

interface IBasicPageSSRProps {
  hey: "no";
}

export const BasicPage: React.FunctionComponent<IBasicPageSSRProps> = () => {
  return (
    <div className="container">
      <div className="app">
        <div>tooling</div>
        <BasicFabric leds={mappingResult.foundLeds} />

        <style jsx global>{`
        canvas {
          //transform: scale(0.5);
          //transform-origin: 0 0;
          width: 100%;
          height: 100%;
        }

        app {
          width: 100%;
          height: 100%;
        }
      `}</style>

        <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .container {
          width: 100vw;
          height: 100vh;
        }

        .app {
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-rows: auto 1fr
        }

        .canvas-wrapper {
          width: 100%;
          height: 100%;
        }
      `}</style>
      </div>
    </div>
  );
};

export default BasicPage;
