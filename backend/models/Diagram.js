const db = require('../config/database');

class Diagram {
  static async create(userId, diagramData, problemId = null, name = null) {
    const result = await db.query(
      'INSERT INTO system_design_diagrams (user_id, problem_id, diagram_data, name) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, problemId, diagramData, name]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT d.*, u.username, p.title as problem_title
       FROM system_design_diagrams d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN problems p ON d.problem_id = p.id
       WHERE d.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByUserId(userId, limit = 100, offset = 0) {
    const result = await db.query(
      `SELECT d.*, p.title as problem_title
       FROM system_design_diagrams d
       LEFT JOIN problems p ON d.problem_id = p.id
       WHERE d.user_id = $1
       ORDER BY d.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async findAll(limit = 100, offset = 0) {
    const result = await db.query(
      `SELECT d.*, u.username, p.title as problem_title
       FROM system_design_diagrams d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN problems p ON d.problem_id = p.id
       ORDER BY d.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
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

    const query = `UPDATE system_design_diagrams SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      'DELETE FROM system_design_diagrams WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Diagram;
