import multer from 'multer';

const config = {
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + "-" + Math.round((Math.random() * 1E9))
      cb(null, file.originalname);
    },
  }),
  // limits: {
  //   fileSize: 1024 * 1024 * 2,
  // },
};

export const upload = multer(config);
