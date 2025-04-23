import { FastifyRequest, FastifyReply } from "fastify";
import mainUploader from "../services/uploaderService.js";
import path from "path";
import fs from "fs/promises";

type UploadBody = {
  url?: string;
};

const TEMP_UPLOAD_DIR = path.join(process.cwd(), "temp");

export default async function uploaderController(
  request: FastifyRequest<{ Body: UploadBody }>,
  reply: FastifyReply
) {
  if (request.body && request.body.url) {
    const url = request.body.url;
    await mainUploader("url", url);
    return reply.send({ message: "url uploaded", url });
  }
  const files = (request as any).files;
  if (!files || files.length === 0) {
    return reply.status(400).send({ message: "No files uploaded" });
  }
  const fileType = path.extname(files[0].originalname).slice(1);
  const fileNamesWitPaths = files.map((file: { filename: string }) =>
    path.join(TEMP_UPLOAD_DIR, file.filename)
  );
  await mainUploader(fileType, null);
  setTimeout(() => {
    for (const file of fileNamesWitPaths) {
      fs.unlink(file);
    }
  }, 100);
  return reply.status(201).send({
    message: "Files uploaded successfully",
    files: files.map((file: any) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    })),
  });
}
