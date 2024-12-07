const multer = require('multer');
const path = require('path')

const tmpDir = path.join(__dirname,'../tmp');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, tmpDir);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
    limits: {
      fileSize: 1048576,
    },
  });
  
  const uploadAvatar = multer({
    storage,
    limits:{
        fileSize:2 * 1024 * 1024
    }
  }).single('avatar');

  module.exports = uploadAvatar;