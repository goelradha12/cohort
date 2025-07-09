import multer from "multer";

// memory storage to store in RAM temporarily
const storage = multer.memoryStorage({
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