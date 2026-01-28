const Diagram = require('../models/Diagram');

// @desc    Create new diagram
// @route   POST /api/diagrams
// @access  Private
exports.createDiagram = async (req, res, next) => {
  try {
    const { diagram_data, problem_id, name } = req.body;

    // Validate input
    if (!diagram_data) {
      return res.status(400).json({
        success: false,
        message: 'Please provide diagram_data'
      });
    }

    const diagram = await Diagram.create(
      req.user.id,
      diagram_data,
      problem_id || null,
      name || null
    );

    res.status(201).json({
      success: true,
      message: 'Diagram created successfully',
      data: diagram
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all diagrams
// @route   GET /api/diagrams
// @access  Private
exports.getAllDiagrams = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const diagrams = await Diagram.findAll(limit, offset);

    res.status(200).json({
      success: true,
      count: diagrams.length,
      data: diagrams
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get diagram by ID
// @route   GET /api/diagrams/:id
// @access  Private
exports.getDiagramById = async (req, res, next) => {
  try {
    const diagram = await Diagram.findById(req.params.id);

    if (!diagram) {
      return res.status(404).json({
        success: false,
        message: 'Diagram not found'
      });
    }

    res.status(200).json({
      success: true,
      data: diagram
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get diagrams by user ID
// @route   GET /api/diagrams/user/:userId
// @access  Private
exports.getDiagramsByUser = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const diagrams = await Diagram.findByUserId(req.params.userId, limit, offset);

    res.status(200).json({
      success: true,
      count: diagrams.length,
      data: diagrams
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update diagram
// @route   PUT /api/diagrams/:id
// @access  Private
exports.updateDiagram = async (req, res, next) => {
  try {
    const { diagram_data, problem_id, name } = req.body;

    // Check if diagram exists and belongs to user
    const existingDiagram = await Diagram.findById(req.params.id);
    if (!existingDiagram) {
      return res.status(404).json({
        success: false,
        message: 'Diagram not found'
      });
    }

    // Check ownership
    if (existingDiagram.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this diagram'
      });
    }

    const updates = {};
    if (diagram_data) updates.diagram_data = diagram_data;
    if (problem_id !== undefined) updates.problem_id = problem_id;
    if (name !== undefined) updates.name = name;

    const diagram = await Diagram.update(req.params.id, updates);

    res.status(200).json({
      success: true,
      message: 'Diagram updated successfully',
      data: diagram
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete diagram
// @route   DELETE /api/diagrams/:id
// @access  Private
exports.deleteDiagram = async (req, res, next) => {
  try {
    // Check if diagram exists and belongs to user
    const existingDiagram = await Diagram.findById(req.params.id);
    if (!existingDiagram) {
      return res.status(404).json({
        success: false,
        message: 'Diagram not found'
      });
    }

    // Check ownership
    if (existingDiagram.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this diagram'
      });
    }

    await Diagram.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Diagram deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
