import _ from "lodash";
import { ActionMessageHandler } from "nice-common";

export const getOrCreateSocketBasedSender = _.memoize(() => {
    const createdSocket = new WebSocket("ws://localhost:8080");
    createdSocket.addEventListener("open", () => {
        console.log("SOCKET: open");
    });
    createdSocket.addEventListener("close", () => {
        console.log("SOCKET: close");
    });
    createdSocket.addEventListener("error", () => {
        console.log("SOCKET: error");
    });
    createdSocket.addEventListener("message", (x) => {
        console.log("SOCKET: message", x.data);
    });

    const socketBasedActionSender: ActionMessageHandler = (message) => {
        createdSocket.send(JSON.stringify(message));
    }

    return socketBasedActionSender;
});