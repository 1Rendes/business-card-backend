import { langchainInit } from "../services/langchainService.js";
import { initialReplyText } from "../locales/translation.js";

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
      const language = req.query.language;
      const { agentExecutor, readConfig, checkpointer, writeConfig } =
        await langchainInit();
      socket.on("message", async (message: string) => {
        const tuple = await checkpointer.getTuple(writeConfig);
        const parsedMessage = message.toString();
        const replyMessage = await agentExecutor.invoke(
          {
            messages: [
              {
                role: "system",
                content: `User system's language is ${language}.`,
              },
              { role: "user", content: parsedMessage },
            ],
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
      const content =
        initialReplyText[language as keyof typeof initialReplyText];
      const initialReply = {
        content: content,
        type: "assistant",
      };
      socket.send(JSON.stringify(initialReply));
    }
  );
}

export default webSocket;
