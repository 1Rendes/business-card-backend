import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";

dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function setupPinecone() {
  const indexName = process.env.PINECONE_INDEX!;
  const indexes = await pc.listIndexes();
  const indexesNames = indexes.indexes?.map((index) => index.name);
  if (indexesNames && indexesNames.includes(indexName) === false) {
    await pc.createIndex({
      name: indexName,
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
    console.log(`Index "${indexName}" created successfully.`);
  } else {
    console.log(`Index "${indexName}" already exists.`);
  }
}
