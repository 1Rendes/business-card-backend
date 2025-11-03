import { ChatOpenAI } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone as PineconemongoClient } from "@pinecone-database/pinecone";
import type { AttributeInfo } from "langchain/chains/query_constructor";
import { SelfQueryRetriever } from "langchain/retrievers/self_query";
import { PineconeTranslator } from "@langchain/pinecone";
import { v4 as uuidv4 } from "uuid";
import { createRetrieverTool } from "langchain/tools/retriever";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import * as dotenv from "dotenv";
import { mongoClient } from "../index.js";
import { sendEmailTool } from "./toolsDescription.js";

dotenv.config();

export async function langchainInit(
  chatName: string = "",
  userId: string = "12345",
  chatId: string = uuidv4()
) {
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.7,
    maxTokens: 1024,
    verbose: false,
  });

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const pinecone = new PineconemongoClient({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

  const attributeInfo: AttributeInfo[] = [
    {
      name: "text",
      type: "string",
      description: "Text from this chunk",
    },
  ];

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  });

  const selfQueryRetriever = SelfQueryRetriever.fromLLM({
    llm: model,
    vectorStore: vectorStore,
    documentContents: "Document containing projects description",
    attributeInfo: attributeInfo,
    structuredQueryTranslator: new PineconeTranslator(),
  });

  const retrieverTool = createRetrieverTool(selfQueryRetriever, {
    name: "documents_retriever",
    description: "Searches and returns documents about Volodymyr's projects.",
  });
  const tools = [retrieverTool, sendEmailTool];

  const writeConfig = {
    configurable: {
      thread_id: { chatName, userId, chatId },
    },
  };
  const readConfig = {
    configurable: {
      thread_id: { chatName, userId, chatId },
    },
  };
  const checkpointer = new MongoDBSaver({ client: mongoClient });
  await checkpointer.get(readConfig);

  const agentExecutor = createReactAgent({
    llm: model,
    tools,
    checkpointSaver: checkpointer,
  });

  return {
    agentExecutor,
    readConfig,
    writeConfig,
    checkpointer,
    mongoClient,
  };
}
