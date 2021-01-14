const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const app = express();
const port = 3000;

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/', (req, res) => res.json({ message: 'Hello World!' }));

const upload = multer();

app.post('/photos/upload', upload.single('image'), async (req, res) => {
  const cld_upload_stream = cloudinary.uploader.upload_stream(
    {
      folder: 'images',
    },
    (err, result) => {
      if (err)
        return res.status(500).json({
          success: false,
          payload: { message: 'Unable to upload image' },
        });
      return res.json({ success: false, payload: result });
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
});

app.listen(port, () =>
  console.log(`This is the beginning of the Node File Upload App`)
);
