import fs from "fs";
import path from "path";

const TEMP_UPLOAD_DIR = path.join(process.cwd(), "temp");

export function createDirIfNotExists() {
  if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
    fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
  }
}
