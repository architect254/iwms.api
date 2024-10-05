import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const configureFileStorage = (prefix: string) => {
  return {
    storage: diskStorage({
      destination: (req, file: any, cb) => {
        cb(null, join(__dirname, '../../../uploads'));
      },
      filename: (req, file: any, cb) => {
        let fileExt = extname(file.originalname);
        cb(null, `${file.originalname}`);
      },
    }),
  };
};
