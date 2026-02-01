// Test the forgot password API endpoint
const testEmail = 'your-email@example.com'; // Replace with your actual email

async function testForgotPassword() {
  console.log('🧪 Testing forgot password API...\n');
  console.log('Email:', testEmail);
  console.log('Endpoint: http://localhost:3000/api/auth/forgot-password\n');

  try {
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ Email sent successfully!');
      if (data.devCode) {
        console.log('🔑 Development code:', data.devCode);
      }
      console.log('\n📧 Check your email inbox for the reset code.');
    } else {
      console.log('\n⚠️ Response received but check the message:', data.message);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testForgotPassword();
