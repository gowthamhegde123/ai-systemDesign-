const express = require('express');
const router = express.Router();
const {
  createDiagram,
  getAllDiagrams,
  getDiagramById,
  getDiagramsByUser,
  updateDiagram,
  deleteDiagram
} = require('../controllers/diagramController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/diagrams:
 *   post:
 *     summary: Create a new diagram
 *     tags: [Diagrams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - diagram_data
 *             properties:
 *               diagram_data:
 *                 type: object
 *               problem_id:
 *                 type: integer
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Diagram created successfully
 */
router.post('/', auth, createDiagram);

/**
 * @swagger
 * /api/diagrams:
 *   get:
 *     summary: Get all diagrams
 *     tags: [Diagrams]
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
 *         description: List of diagrams
 */
router.get('/', auth, getAllDiagrams);

/**
 * @swagger
 * /api/diagrams/{id}:
 *   get:
 *     summary: Get diagram by ID
 *     tags: [Diagrams]
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
 *         description: Diagram found
 *       404:
 *         description: Diagram not found
 */
router.get('/:id', auth, getDiagramById);

/**
 * @swagger
 * /api/diagrams/user/{userId}:
 *   get:
 *     summary: Get diagrams by user ID
 *     tags: [Diagrams]
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
 *         description: List of user diagrams
 */
router.get('/user/:userId', auth, getDiagramsByUser);

/**
 * @swagger
 * /api/diagrams/{id}:
 *   put:
 *     summary: Update diagram
 *     tags: [Diagrams]
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
 *               diagram_data:
 *                 type: object
 *               problem_id:
 *                 type: integer
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Diagram updated successfully
 */
router.put('/:id', auth, updateDiagram);

/**
 * @swagger
 * /api/diagrams/{id}:
 *   delete:
 *     summary: Delete diagram
 *     tags: [Diagrams]
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
 *         description: Diagram deleted successfully
 */
router.delete('/:id', auth, deleteDiagram);

module.exports = router;
