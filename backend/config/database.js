require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration!');
  console.error('SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('SUPABASE_KEY:', supabaseKey ? '✅' : '❌');
  throw new Error('Supabase URL and Key are required');
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client initialized');

// For backward compatibility, export a pool-like interface
const pool = {
  query: async (text, params) => {
    // This is a simplified adapter - you may need to adjust based on your queries
    console.log('⚠️  Using Supabase client instead of pg pool');
    throw new Error('Please use Supabase client directly instead of pool.query');
  },
  connect: async () => {
    console.log('✅ Supabase client ready');
    return {
      query: pool.query,
      release: () => {}
    };
  },
  on: (event, callback) => {
    if (event === 'connect') {
      console.log('✅ Supabase client ready');
      callback();
    }
  }
};

module.exports = pool;
module.exports.supabase = supabase;
