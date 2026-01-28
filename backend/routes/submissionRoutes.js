const express = require('express');
const router = express.Router();
const {
  createSubmission,
  getAllSubmissions,
  getSubmissionById,
  getSubmissionsByUser,
  getSubmissionsByProblem,
  updateSubmission,
  deleteSubmission,
  getLeaderboard
} = require('../controllers/submissionController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/submissions:
 *   post:
 *     summary: Create a new submission
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - problem_id
 *               - solution
 *             properties:
 *               problem_id:
 *                 type: integer
 *               solution:
 *                 type: string
 *               score:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       201:
 *         description: Submission created successfully
 */
router.post('/', auth, createSubmission);

/**
 * @swagger
 * /api/submissions:
 *   get:
 *     summary: Get all submissions
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of submissions
 */
router.get('/', auth, getAllSubmissions);

/**
 * @swagger
 * /api/submissions/{id}:
 *   get:
 *     summary: Get submission by ID
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Submission found
 *       404:
 *         description: Submission not found
 */
router.get('/:id', auth, getSubmissionById);

/**
 * @swagger
 * /api/submissions/user/{userId}:
 *   get:
 *     summary: Get submissions by user ID
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user submissions
 */
router.get('/user/:userId', auth, getSubmissionsByUser);

/**
 * @swagger
 * /api/submissions/problem/{problemId}:
 *   get:
 *     summary: Get submissions by problem ID
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: problemId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of problem submissions
 */
router.get('/problem/:problemId', auth, getSubmissionsByProblem);

/**
 * @swagger
 * /api/submissions/{id}:
 *   put:
 *     summary: Update submission
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               solution:
 *                 type: string
 *               score:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Submission updated successfully
 */
router.put('/:id', auth, updateSubmission);

/**
 * @swagger
 * /api/submissions/{id}:
 *   delete:
 *     summary: Delete submission
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Submission deleted successfully
 */
router.delete('/:id', auth, deleteSubmission);

module.exports = router;
module.exports.getLeaderboard = getLeaderboard;
