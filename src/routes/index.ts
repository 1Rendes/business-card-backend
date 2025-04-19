import { FastifyInstance } from "fastify";
import { getLivekitToken } from "./livekit/getLivekitToken";

export default async function routes(fastify: FastifyInstance) {
  fastify.register(getLivekitToken);
}
