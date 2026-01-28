const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const path = require('path');

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow images and common file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|svg|json/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, SVGs and JSON files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// @desc    Upload file to S3
// @route   POST /api/upload
// @access  Private
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const folder = req.body.folder || 'uploads';
    const key = `${folder}/${fileName}`;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read'
      }
    });

    const result = await upload.done();

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        key: key,
        bucket: process.env.AWS_S3_BUCKET
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete file from S3
// @route   DELETE /api/upload/:key
// @access  Private
exports.deleteFile = async (req, res, next) => {
  try {
    const { key } = req.params;

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    });

    await s3Client.send(command);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports.upload = upload;
