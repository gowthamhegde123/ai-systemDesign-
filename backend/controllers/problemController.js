const Problem = require('../models/Problem');

// @desc    Create new problem
// @route   POST /api/problems
// @access  Private
exports.createProblem = async (req, res, next) => {
  try {
    const { title, description, difficulty, tags } = req.body;

    // Validate input
    if (!title || !description || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description and difficulty'
      });
    }

    // Validate difficulty
    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Difficulty must be Easy, Medium or Hard'
      });
    }

    const problem = await Problem.create(title, description, difficulty, tags || []);

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: problem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all problems
// @route   GET /api/problems
// @access  Public
exports.getAllProblems = async (req, res, next) => {
  try {
    const filters = {
      difficulty: req.query.difficulty,
      tag: req.query.tag,
      limit: parseInt(req.query.limit) || 100,
      offset: parseInt(req.query.offset) || 0
    };

    const problems = await Problem.findAll(filters);

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get problem by ID
// @route   GET /api/problems/:id
// @access  Public
exports.getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private
exports.updateProblem = async (req, res, next) => {
  try {
    const { title, description, difficulty, tags } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (difficulty) {
      const validDifficulties = ['Easy', 'Medium', 'Hard'];
      if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({
          success: false,
          message: 'Difficulty must be Easy, Medium or Hard'
        });
      }
      updates.difficulty = difficulty;
    }
    if (tags) updates.tags = tags;

    const problem = await Problem.update(req.params.id, updates);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Problem updated successfully',
      data: problem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private
exports.deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.delete(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
