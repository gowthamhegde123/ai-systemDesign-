const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
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

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${folder}/${fileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.Location,
        key: result.Key,
        bucket: result.Bucket
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

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };

    await s3.deleteObject(params).promise();

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
