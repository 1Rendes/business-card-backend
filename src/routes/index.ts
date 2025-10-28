import { FastifyInstance } from "fastify";
import { getLivekitToken } from "./livekit/getLivekitToken.js";
import uploadFiles from "./pinecone/uploadFiles.js";
import uploadUrl from "./pinecone/uploadUrl.js";
import ping from "./ping.js";
import websocket from "./websocket.js";
import feedback from "./feedback.js";

export default async function routes(fastify: FastifyInstance) {
  fastify.register(getLivekitToken);
  fastify.register(uploadFiles);
  fastify.register(uploadUrl);
  fastify.register(ping);
  fastify.register(websocket);
  fastify.register(feedback);
}
