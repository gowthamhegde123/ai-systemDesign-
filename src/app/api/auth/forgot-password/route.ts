import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user exists
        const { data: user } = await supabase
            .from('users')
            .select('id')
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

        // Send email
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: Number(process.env.SMTP_PORT) || 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: '"SystemDesign.AI" <noreply@systemdesign.ai>',
                to: email,
                subject: "Your Password Reset Code",
                text: `Your reset code is: ${code}. It expires in 10 minutes.`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; background-color: #0a0a0c; color: #ffffff;">
                        <div style="max-width: 600px; margin: auto; background-color: #161618; padding: 40px; border-radius: 24px; border: 1px solid #27272a;">
                            <h2 style="color: #7c3aed; margin-bottom: 20px; font-weight: 900; letter-spacing: -0.05em;">Password Reset</h2>
                            <p style="font-size: 16px; color: #a1a1aa;">You requested a password reset for your SystemDesign.AI account.</p>
                            <div style="background-color: #27272a; padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0; border: 1px solid #3f3f46;">
                                <span style="font-size: 36px; font-weight: 900; letter-spacing: 12px; color: #ffffff;">${code}</span>
                            </div>
                            <p style="font-size: 14px; color: #71717a;">This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
                        </div>
                    </div>
                `
            });
        } else {
            console.warn('SMTP credentials missing. Reset code logged to console for development:', code);
        }

        return NextResponse.json({ message: 'Reset code sent' });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
