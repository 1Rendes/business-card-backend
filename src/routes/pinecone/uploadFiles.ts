import { FastifyInstance, FastifyRequest } from "fastify";
import { upload } from "../../scripts/multer.js";
import uploaderController from "../../controllers/uploaderController.js";
import { uploadFilesSchema } from "../../schemas/uploadFilesSchema.js";

async function uploadFiles(fastify: FastifyInstance) {
  fastify.post("/upload/files", {
    preHandler: upload.array("", 5),
    schema: uploadFilesSchema,
    handler: uploaderController,
  });
}

export default uploadFiles;
