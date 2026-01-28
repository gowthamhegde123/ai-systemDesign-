const { pool } = require('./database');

const createTables = async () => {
  try {
    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table created');

    // Create Problems table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS problems (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Problems table created');

    // Create Submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
        solution TEXT NOT NULL,
        score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Submissions table created');

    // Create SystemDesignDiagrams table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_design_diagrams (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        problem_id INTEGER REFERENCES problems(id) ON DELETE SET NULL,
        diagram_data JSONB NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ SystemDesignDiagrams table created');

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON submissions(problem_id);
      CREATE INDEX IF NOT EXISTS idx_diagrams_user_id ON system_design_diagrams(user_id);
    `);
    console.log('✓ Indexes created');

    console.log('\n✅ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

createTables();
