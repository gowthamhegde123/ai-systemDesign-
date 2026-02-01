const { Resend } = require('resend');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('🧪 Testing Resend email service...\n');
  console.log('API Key:', process.env.RESEND_API_KEY ? '✅ Found' : '❌ Missing');
  console.log('Frontend URL:', process.env.FRONTEND_URL);
  console.log('App Name:', process.env.APP_NAME);
  console.log('\n📧 Sending test email...\n');

  try {
    const { data, error } = await resend.emails.send({
      from: 'SystemDesign.AI <noreply@systemdesign.ai>',
      to: ['delivered@resend.dev'], // Resend test email
      subject: 'Test Email from SystemDesign.AI',
      html: '<h1>Test Email</h1><p>If you receive this, your email service is working!</p>',
    });

    if (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', data.id);
    console.log('\n🎉 Your email service is working!');
    console.log('\nNext steps:');
    console.log('1. Check https://resend.com/emails to see the email');
    console.log('2. Try sending to your actual email address');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

testEmail();
