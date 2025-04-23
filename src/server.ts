import dotenv from "dotenv";
import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyMultipart from "@fastify/multipart";
import routes from "./routes/index.js";

dotenv.config();

const server = fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  },
  maxParamLength: 150,
});

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  preflightContinue: false,
});

server.register(fastifyHelmet);
server.register(fastifyMultipart);
server.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

server.register(routes);

const start = async () => {
  try {
    const PORT = Number(process.env.PORT) || 3001;
    await server.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
export default start;
