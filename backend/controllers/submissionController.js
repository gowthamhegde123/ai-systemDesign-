const Submission = require('../models/Submission');

// @desc    Create new submission
// @route   POST /api/submissions
// @access  Private
exports.createSubmission = async (req, res, next) => {
  try {
    const { problem_id, solution, score } = req.body;

    // Validate input
    if (!problem_id || !solution) {
      return res.status(400).json({
        success: false,
        message: 'Please provide problem_id and solution'
      });
    }

    // Validate score
    if (score !== undefined && (score < 0 || score > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Score must be between 0 and 100'
      });
    }

    const submission = await Submission.create(
      req.user.id,
      problem_id,
      solution,
      score || 0
    );

    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private
exports.getAllSubmissions = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const submissions = await Submission.findAll(limit, offset);

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
exports.getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submissions by user ID
// @route   GET /api/submissions/user/:userId
// @access  Private
exports.getSubmissionsByUser = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const submissions = await Submission.findByUserId(req.params.userId, limit, offset);

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submissions by problem ID
// @route   GET /api/submissions/problem/:problemId
// @access  Private
exports.getSubmissionsByProblem = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const submissions = await Submission.findByProblemId(req.params.problemId, limit, offset);

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update submission
// @route   PUT /api/submissions/:id
// @access  Private
exports.updateSubmission = async (req, res, next) => {
  try {
    const { solution, score } = req.body;

    const updates = {};
    if (solution) updates.solution = solution;
    if (score !== undefined) {
      if (score < 0 || score > 100) {
        return res.status(400).json({
          success: false,
          message: 'Score must be between 0 and 100'
        });
      }
      updates.score = score;
    }

    const submission = await Submission.update(req.params.id, updates);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission updated successfully',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private
exports.deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.delete(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await Submission.getLeaderboard(limit);

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};
