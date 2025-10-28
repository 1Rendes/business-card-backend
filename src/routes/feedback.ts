import { FastifyInstance } from "fastify";
import feedbackController from "../controllers/feedbackController.js";
import { feedbackSchema } from "../schemas/feedbackSchema.js";

async function feedback(fastify: FastifyInstance) {
  fastify.post("/api/feedback", {
    schema: feedbackSchema,
    handler: feedbackController,
  });
}

export default feedback;

