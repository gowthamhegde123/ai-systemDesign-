import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user exists
        const { data: user } = await supabase
            .from('users')
            .select('id, username')
            .eq('email', email)
            .single();

        if (!user) {
            // Don't reveal if user exists or not for security, but we'll return success
            return NextResponse.json({ message: 'If an account exists, a code has been sent.' });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store code
        await supabase.from('password_resets').insert({
            email,
            code,
            expires_at: expiresAt.toISOString(),
        });

        // Send email with Resend
        try {
            const { data, error } = await resend.emails.send({
                from: 'SystemDesign.AI <noreply@systemdesign.ai>',
                to: [email],
                subject: '🔐 Password Reset Code - SystemDesign.AI',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                            .otp-box { background: white; border: 2px dashed #f5576c; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
                            .otp-code { font-size: 32px; font-weight: bold; color: #f5576c; letter-spacing: 5px; }
                            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🔐 Password Reset Request</h1>
                            </div>
                            <div class="content">
                                <h2>Hi ${user.username || 'there'},</h2>
                                <p>We received a request to reset your password. Use the code below to proceed:</p>
                                <div class="otp-box">
                                    <p style="margin: 0; color: #666; font-size: 14px;">Your Reset Code</p>
                                    <div class="otp-code">${code}</div>
                                </div>
                                <div class="warning">
                                    <strong>⚠️ Important:</strong>
                                    <ul style="margin: 10px 0;">
                                        <li>This code is valid for <strong>10 minutes</strong></li>
                                        <li>Do not share this code with anyone</li>
                                        <li>If you didn't request this, please ignore this email</li>
                                    </ul>
                                </div>
                                <p>Enter this code on the password reset page to continue.</p>
                            </div>
                            <div class="footer">
                                <p>&copy; ${new Date().getFullYear()} SystemDesign.AI. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
            });

            if (error) {
                console.error('Resend error:', error);
                
                // Check if it's a domain verification error
                if (error.message?.includes('verify a domain') || error.statusCode === 403) {
                    console.log('⚠️ Resend requires domain verification to send to other emails');
                    console.log('📧 For testing, only hegde0579@gmail.com can receive emails');
                    console.log('🔑 Reset code for development:', code);
                    
                    // In development, return the code so user can still test
                    if (process.env.NODE_ENV === 'development') {
                        return NextResponse.json({ 
                            message: 'Reset code generated. Note: Resend free tier only sends to hegde0579@gmail.com. Check console for code.',
                            devCode: code,
                            success: true,
                            warning: 'Email service requires domain verification. Using development mode.'
                        });
                    }
                }
                
                // In development, still return the code
                if (process.env.NODE_ENV === 'development') {
                    console.log('Reset code for development:', code);
                    return NextResponse.json({ 
                        message: 'Email service error, but code generated', 
                        devCode: code,
                        success: true
                    });
                }
                throw error;
            }

            console.log('✅ Password reset email sent successfully via Resend');
            console.log('Email ID:', data?.id);
            
            return NextResponse.json({ 
                message: 'Reset code sent to your email',
                success: true
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            
            // In development, log the code
            if (process.env.NODE_ENV === 'development') {
                console.log('Reset code for development:', code);
                return NextResponse.json({ 
                    message: 'Email failed but code generated (check console)', 
                    devCode: code,
                    success: true
                });
            }
            
            throw emailError;
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Failed to process password reset request.' }, { status: 500 });
    }
}
