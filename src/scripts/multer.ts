import multer from "fastify-multer";
import path from "path";
import { createDirIfNotExists } from "./createDirIfNotExists.js";

const TEMP_UPLOAD_DIR = path.join(process.cwd(), "temp");
createDirIfNotExists();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
