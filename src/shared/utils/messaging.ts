import type { MessageMap, MessageType } from "@/shared/types";

export function sendMessage<T extends MessageType>(
  type: T,
  data: MessageMap[T]["request"],
): Promise<MessageMap[T]["response"]> {
  return chrome.runtime.sendMessage({ type, data });
}

export type MessageHandler = {
  [K in MessageType]?: (
    data: MessageMap[K]["request"],
    sender: chrome.runtime.MessageSender,
  ) => Promise<MessageMap[K]["response"]> | MessageMap[K]["response"];
};

export function createMessageListener(handlers: MessageHandler): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { type, data } = message as {
      type: MessageType;
      data: unknown;
    };

    const handler = handlers[type];
    if (handler) {
      const result = (handler as (data: unknown, sender: chrome.runtime.MessageSender) => unknown)(data, sender);
      if (result instanceof Promise) {
        result.then(sendResponse);
        return true; // Keep message channel open for async
      }
      sendResponse(result);
    }
  });
}
