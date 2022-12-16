import { useEffect, useState } from "react";

const fps = 15;
const fpsInterval = 1000 / fps;

export function useAnimationTimer() {

    const [elapsed, setTime] = useState(0);

    useEffect(
        () => {
            let previousSnapshot = Date.now();
            let animationFrame: number, timerStop: number, start: number;
            // Function to be executed on each animation frame
            function onFrame() {
                const now = Date.now();
                const diff = now - previousSnapshot;
                if (diff > fpsInterval) {
                    setTime(Date.now() - start);
                    previousSnapshot = now;
                }

                loop();
            }
            // Call onFrame() on next animation frame
            function loop() {
                animationFrame = requestAnimationFrame(onFrame);
            }
            function onStart() {
                // Start the loop
                start = Date.now();
                loop();
            }

            const timerDelay = setTimeout(onStart, 0);
            // Clean things up
            return () => {
                clearTimeout(timerStop);
                clearTimeout(timerDelay);
                cancelAnimationFrame(animationFrame);
            };
        },
        []
    );
    return elapsed;
}