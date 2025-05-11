import { log } from "console";
import { langchainInit } from "../services/langchainService.js";

async function webSocket(fastify: {
  get: (
    arg0: string,
    arg1: {
      websocket: boolean;
    },
    arg2: (socket: any, req: any) => Promise<void>
  ) => void;
}) {
  fastify.get(
    "/ws",
    {
      websocket: true,
    },
    async (socket, req) => {
      const chatName = req.query.chatName || "";
      const userId = req.query.userId;
      const chatId = req.query.chatId;
      const { agentExecutor, readConfig, checkpointer, writeConfig } =
        await langchainInit(chatName, userId, chatId);
      socket.on("message", async (message: string) => {
        const tuple = await checkpointer.getTuple(writeConfig);
        const parsedMessage = message.toString();
        const replyMessage = await agentExecutor.invoke(
          {
            messages: [{ role: "user", content: parsedMessage }],
          },
          readConfig
        );
        const reply = {
          content:
            replyMessage.messages[replyMessage.messages.length - 1].content,
          type: "assistant",
        };
        if (tuple)
          await checkpointer.put(
            tuple.config,
            tuple.checkpoint,
            tuple.metadata!
          );
        socket.send(JSON.stringify(reply));
      });
      const initialReply = {
        content:
          "Welcome! I'm Volodymyr's assistant. Ask me anything about his projects.",
        type: "assistant",
      };
      socket.send(JSON.stringify(initialReply));
    }
  );
}

export default webSocket;
