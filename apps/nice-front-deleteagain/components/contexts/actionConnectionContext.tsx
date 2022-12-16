import { ActionMessageHandler, NiceActionMessage } from "@nice/nice-common-delete";
import React, { createContext, useMemo } from "react";

interface IActionConnectionContext {
  sendMessage(message: NiceActionMessage): void;
}

export const ActionConnectionContext = createContext<IActionConnectionContext>(
  null as unknown as IActionConnectionContext
);

interface IActionConnectionProviderProps {
  messageHandler: ActionMessageHandler;
}

export const ActionConnectionProvider: React.FunctionComponent<
  React.PropsWithChildren<IActionConnectionProviderProps>
> = (props) => {
  const { messageHandler } = props;

  const socketContext = useMemo((): IActionConnectionContext => {
    const sendMessage = async (message: NiceActionMessage) => {
      messageHandler(message);
    };

    return {
      sendMessage,
    };
  }, [messageHandler]);

  return (
    <ActionConnectionContext.Provider value={socketContext}>
      {props.children}
    </ActionConnectionContext.Provider>
  );
};
