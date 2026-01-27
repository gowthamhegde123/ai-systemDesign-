import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

        // Send email with Formspree (instant delivery)
        if (process.env.FORMSPREE_FORM_ID) {
            try {
                const formspreeResponse = await fetch(`https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        subject: 'Your Password Reset Code - SystemDesign.AI',
                        message: `Your password reset code is: ${code}. This code will expire in 10 minutes.`,
                        _replyto: email,
                        _subject: 'Password Reset Code',
                        _template: 'table',
                        code: code,
                        app_name: 'SystemDesign.AI'
                    }),
                });

                if (formspreeResponse.ok) {
                    console.log('Email sent successfully via Formspree');
                } else {
                    console.error('Formspree email failed:', await formspreeResponse.text());
                    console.log('Reset code for development:', code);
                }
            } catch (emailError) {
                console.error('Formspree request failed:', emailError);
                console.log('Reset code for development:', code);
            }
        } else {
            console.warn('FORMSPREE_FORM_ID missing. Reset code logged to console:', code);
            // For development - also return code in response (remove in production!)
            if (process.env.NODE_ENV === 'development') {
                return NextResponse.json({ 
                    message: 'Reset code generated (check console for code)', 
                    devCode: code, // Only in development
                    success: true
                });
            }
        }

        return NextResponse.json({ message: 'Reset code sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Failed to process password reset request.' }, { status: 500 });
    }
}
