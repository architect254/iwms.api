import { diskStorage } from 'multer';
import {extname, join} from 'path';

export const STORAGE = {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, join(__dirname, '../../uploads'));
      },
      filename: (req, file, cb) => {
        let fileExt = extname(file.originalname);
        cb(null, 'user-' + Date.now() + fileExt);
      },
    }),
  };
  