const pool = require('./config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🚀 Running email verification & OTP migration...\n');
    
    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', 'add_email_verification_otp.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute migration
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!\n');
    console.log('Added columns:');
    console.log('  - email_verified');
    console.log('  - verification_token');
    console.log('  - verification_token_expires');
    console.log('  - reset_otp');
    console.log('  - reset_otp_expires\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();

