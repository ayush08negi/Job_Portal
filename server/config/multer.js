import multer from 'multer'

// const storage = multer.diskStorage({})

// const upload = multer({storage})

// Multer Configuration
const storage = multer.memoryStorage(); // Store file in memory
// const fileFilter = (req, file, cb) => {
//   // Accept only image files
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// Multer Instance
const upload = multer({
  storage,
//   fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 5MB file size limit
});

export default upload