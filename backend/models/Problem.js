const db = require('../config/database');

class Problem {
  static async create(title, description, difficulty, tags = []) {
    const result = await db.query(
      'INSERT INTO problems (title, description, difficulty, tags) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, difficulty, tags]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM problems WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM problems WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.difficulty) {
      query += ` AND difficulty = $${paramCount}`;
      values.push(filters.difficulty);
      paramCount++;
    }

    if (filters.tag) {
      query += ` AND $${paramCount} = ANY(tags)`;
      values.push(filters.tag);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await db.query(query, values);
    return result.rows;
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (key !== 'id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE problems SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      'DELETE FROM problems WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  static async count() {
    const result = await db.query('SELECT COUNT(*) FROM problems');
    return parseInt(result.rows[0].count);
  }
}

module.exports = Problem;
