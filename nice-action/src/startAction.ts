import * as WebSocket from "ws";

interface IObjectAndPosition {
    // This is more future stuff where we could be given tracked points (sticky id).
    id: string;

    // Estimated contact point with the ice.
    ice: ICoordinate;
}

// Store coordinates as a simple array for low payload size.
type ICoordinate = [x: number, y: number];



async function run() {
    try {
        const wss = new WebSocket.Server({ port: 8080 });

        wss.on('connection', function connection(ws) {
            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
            });

            ws.send('something');
        });

        console.log("Started on: " + JSON.stringify(wss.address(), null, 2));
    } catch (error) {
        console.error(error);
    }
}

run();
