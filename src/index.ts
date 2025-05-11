import { initMongoConnection } from "./db/mongoInit.js";
import { setupPinecone } from "./scripts/SetupPinecone.js";
import start from "./server.js";

export const mongoClient = await initMongoConnection();

const bootstrap = () => {
  setupPinecone();
  start();
};

bootstrap();
