const pool = require('./config/database');

async function checkDatabase() {
  console.log('🔍 Checking database configuration...\n');

  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully!\n');

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('❌ Users table does not exist!');
      console.log('Please create the users table first.');
      client.release();
      process.exit(1);
    }

    console.log('✅ Users table exists\n');

    // Check for email verification columns
    const columnsCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('email_verified', 'verification_token', 'verification_token_expires', 'reset_otp', 'reset_otp_expires')
      ORDER BY column_name;
    `);

    console.log('📋 Email/OTP columns in users table:');
    if (columnsCheck.rows.length === 0) {
      console.log('❌ No email verification columns found!');
      console.log('\n⚠️  You need to run the migration!');
      console.log('Go to: https://supabase.com/dashboard/project/dhvwiewnaqupbllzgolo/sql/new');
      console.log('And run the SQL from: backend/migrations/add_email_verification_otp.sql');
    } else {
      columnsCheck.rows.forEach(row => {
        console.log(`  ✅ ${row.column_name} (${row.data_type})`);
      });
      
      if (columnsCheck.rows.length === 5) {
        console.log('\n🎉 All required columns exist! Database is ready!');
      } else {
        console.log(`\n⚠️  Only ${columnsCheck.rows.length}/5 columns found. Please run the migration.`);
      }
    }

    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
