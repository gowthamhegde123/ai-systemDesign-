const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    const { username, email, password, fullName } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (username, email, password, full_name, email_verified, created_at)
      VALUES ($1, $2, $3, $4, false, NOW())
      RETURNING id, username, email, full_name, email_verified, created_at
    `;
    
    const result = await pool.query(query, [username, email, hashedPassword, fullName]);
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT id, username, email, full_name, email_verified, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Set verification token
  static async setVerificationToken(userId, token, expiresAt) {
    const query = `
      UPDATE users 
      SET verification_token = $1, verification_token_expires = $2
      WHERE id = $3
    `;
    await pool.query(query, [token, expiresAt, userId]);
  }

  // Verify email
  static async verifyEmail(token) {
    const query = `
      UPDATE users 
      SET email_verified = true, verification_token = NULL, verification_token_expires = NULL
      WHERE verification_token = $1 AND verification_token_expires > NOW()
      RETURNING id, username, email, email_verified
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  // Set OTP for password reset
  static async setPasswordResetOTP(email, otp, expiresAt) {
    const query = `
      UPDATE users 
      SET reset_otp = $1, reset_otp_expires = $2
      WHERE email = $3
      RETURNING id, email
    `;
    const result = await pool.query(query, [otp, expiresAt, email]);
    return result.rows[0];
  }

  // Verify OTP
  static async verifyOTP(email, otp) {
    const query = `
      SELECT id, email, reset_otp, reset_otp_expires 
      FROM users 
      WHERE email = $1 AND reset_otp = $2 AND reset_otp_expires > NOW()
    `;
    const result = await pool.query(query, [email, otp]);
    return result.rows[0];
  }

  // Reset password
  static async resetPassword(email, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `
      UPDATE users 
      SET password = $1, reset_otp = NULL, reset_otp_expires = NULL
      WHERE email = $2
      RETURNING id, email
    `;
    const result = await pool.query(query, [hashedPassword, email]);
    return result.rows[0];
  }

  // Check if email exists
  static async emailExists(email) {
    const query = 'SELECT id FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  }

  // Check if username exists
  static async usernameExists(username) {
    const query = 'SELECT id FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows.length > 0;
  }
}

module.exports = User;
