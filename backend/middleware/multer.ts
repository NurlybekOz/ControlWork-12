import multer from "multer";
import {promises as fs} from 'fs';
import path from "path";
import config from "../config";
import {randomUUID} from "node:crypto";

const imageStorage = multer.diskStorage({
    destination: async (_req, _file, cb) => {
        const destDir = path.join(config.publicPath, 'images');
        await fs.mkdir(destDir, { recursive: true });
        cb(null, destDir);
    },
    filename: async (_req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, randomUUID() + extension);

    }
})

export const imagesUpload = multer({storage: imageStorage});