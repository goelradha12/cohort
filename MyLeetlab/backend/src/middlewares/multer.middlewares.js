import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/images')
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id + '-' + 'avatar' + '-' + file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1000 * 1000, // 1 MB
  }
})
export default upload;