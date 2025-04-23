import { setupPinecone } from "./scripts/SetupPinecone.js";
import start from "./server.js";

const bootstrap = () => {
  setupPinecone();
  start();
};

bootstrap();
