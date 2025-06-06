import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, 'avatar'  + '-' + req.user._id)
  }
})

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1*1000*1000, // 1 MB
    } 
})
export default upload;