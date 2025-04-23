import { FastifyInstance } from "fastify";
import uploaderController from "../../controllers/uploaderController.js";
import { uploadUrlSchema } from "../../schemas/uploadUrlSchema.js";

async function uploadUrl(fastify: FastifyInstance) {
  fastify.post("/upload/url", {
    schema: uploadUrlSchema,
    handler: uploaderController,
  });
}

export default uploadUrl;
