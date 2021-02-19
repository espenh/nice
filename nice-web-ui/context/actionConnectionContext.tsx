import { createContext, useMemo } from "react";
import { NiceActionMessage } from "../model/shared/messageContracts";

interface ISocketContext {
  socket: WebSocket;
  sendMessage(message: NiceActionMessage): void;
}

export const ActionConnectionContext = createContext<ISocketContext>(
  (null as unknown) as ISocketContext
);

export const ActionConnectionProvider: React.FunctionComponent = (props) => {
  const socket = useMemo(() => {
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

    return createdSocket;
  }, []);

  console.log("Setting context: " + socket);

  const socketContext = useMemo((): ISocketContext => {
    const sendMessage = (message: NiceActionMessage) => {
      socket.send(JSON.stringify(message));
    };

    return {
      socket,
      sendMessage,
    };
  }, [socket]);

  return (
    <ActionConnectionContext.Provider value={socketContext}>
      {props.children}
    </ActionConnectionContext.Provider>
  );
};
