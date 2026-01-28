const express = require('express');
const router = express.Router();
const { uploadFile, deleteFile, upload } = require('../controllers/uploadController');
const auth = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload file to S3
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file provided
 */
router.post('/', auth, uploadLimiter, upload.single('file'), uploadFile);

/**
 * @swagger
 * /api/upload/{key}:
 *   delete:
 *     summary: Delete file from S3
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 */
router.delete('/:key', auth, deleteFile);

module.exports = router;
