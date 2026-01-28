const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
exports.getAllUsers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const users = await User.findAll(limit, offset);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Users can only update their own profile (or admin can update any)
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = password;

    const user = await User.update(req.params.id, updates);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
exports.deleteUser = async (req, res, next) => {
  try {
    // Users can only delete their own account (or admin can delete any)
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this user'
      });
    }

    const user = await User.delete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
