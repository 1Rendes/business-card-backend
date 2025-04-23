import { FastifyInstance } from "fastify";
import { getLivekitTokenController } from "../../controllers/getLivekitTokenController.js";

export const getLivekitToken = (fastify: FastifyInstance) => {
  fastify.get("/get-livekit-token", getLivekitTokenController);
};
