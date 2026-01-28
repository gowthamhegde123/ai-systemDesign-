const express = require('express');
const router = express.Router();
const {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem
} = require('../controllers/problemController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/problems:
 *   post:
 *     summary: Create a new problem
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - difficulty
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Problem created successfully
 */
router.post('/', auth, createProblem);

/**
 * @swagger
 * /api/problems:
 *   get:
 *     summary: Get all problems
 *     tags: [Problems]
 *     parameters:
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [Easy, Medium, Hard]
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
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
 *         description: List of problems
 */
router.get('/', getAllProblems);

/**
 * @swagger
 * /api/problems/{id}:
 *   get:
 *     summary: Get problem by ID
 *     tags: [Problems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Problem found
 *       404:
 *         description: Problem not found
 */
router.get('/:id', getProblemById);

/**
 * @swagger
 * /api/problems/{id}:
 *   put:
 *     summary: Update problem
 *     tags: [Problems]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Problem updated successfully
 */
router.put('/:id', auth, updateProblem);

/**
 * @swagger
 * /api/problems/{id}:
 *   delete:
 *     summary: Delete problem
 *     tags: [Problems]
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
 *         description: Problem deleted successfully
 */
router.delete('/:id', auth, deleteProblem);

module.exports = router;
