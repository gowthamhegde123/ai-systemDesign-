const db = require('../config/database');

class Submission {
  static async create(userId, problemId, solution, score = 0) {
    const result = await db.query(
      'INSERT INTO submissions (user_id, problem_id, solution, score) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, problemId, solution, score]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT s.*, u.username, u.email, p.title as problem_title, p.difficulty 
       FROM submissions s
       JOIN users u ON s.user_id = u.id
       JOIN problems p ON s.problem_id = p.id
       WHERE s.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findAll(limit = 100, offset = 0) {
    const result = await db.query(
      `SELECT s.*, u.username, p.title as problem_title, p.difficulty 
       FROM submissions s
       JOIN users u ON s.user_id = u.id
       JOIN problems p ON s.problem_id = p.id
       ORDER BY s.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async findByUserId(userId, limit = 100, offset = 0) {
    const result = await db.query(
      `SELECT s.*, p.title as problem_title, p.difficulty 
       FROM submissions s
       JOIN problems p ON s.problem_id = p.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async findByProblemId(problemId, limit = 100, offset = 0) {
    const result = await db.query(
      `SELECT s.*, u.username 
       FROM submissions s
       JOIN users u ON s.user_id = u.id
       WHERE s.problem_id = $1
       ORDER BY s.score DESC, s.created_at DESC
       LIMIT $2 OFFSET $3`,
      [problemId, limit, offset]
    );
    return result.rows;
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'user_id' && key !== 'created_at') {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE submissions SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      'DELETE FROM submissions WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  static async getLeaderboard(limit = 10) {
    const result = await db.query(
      `SELECT 
        u.id,
        u.username,
        u.email,
        COUNT(DISTINCT s.problem_id) as problems_solved,
        COALESCE(AVG(s.score), 0) as average_score,
        COALESCE(SUM(s.score), 0) as total_score,
        MAX(s.created_at) as last_submission
       FROM users u
       LEFT JOIN submissions s ON u.id = s.user_id
       GROUP BY u.id, u.username, u.email
       ORDER BY total_score DESC, average_score DESC, problems_solved DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
}

module.exports = Submission;
