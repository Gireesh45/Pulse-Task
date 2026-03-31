import multer from 'multer';
import p from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = p.join(__dirname, '../../../uploads');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\\s+/g, '_')}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 500 }, // 500 MB limit
  fileFilter
});
