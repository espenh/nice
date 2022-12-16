import { useEffect, useState } from "react";
import { useScript } from "./useScript";

declare const cv: any;

export function useOpenCv(): boolean {
    const [ready, setReady] = useState(false);
    const opencv = useScript("/libs/opencv.js");

    useEffect(() => {
        if (opencv === "ready") {
            if (cv.getBuildInformation) {
                console.log(cv.getBuildInformation());
                setReady(true);
            }
            else {
                // WASM
                cv['onRuntimeInitialized'] = () => {
                    console.log(cv.getBuildInformation());
                    setReady(true);
                }
            }
        }
    }, [opencv])

    return ready;
}