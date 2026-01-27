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
            // Don't reveal if user exists or not for security
            return NextResponse.json({ message: 'If an account exists, a code has been sent.' });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store code in database
        await supabase.from('password_resets').insert({
            email,
            code,
            expires_at: expiresAt.toISOString(),
        });

        // Return the code to frontend for immediate email sending
        return NextResponse.json({ 
            message: 'Code generated successfully',
            code, // Send code to frontend for immediate email
            email 
        });
    } catch (error) {
        console.error('Generate OTP error:', error);
        return NextResponse.json({ error: 'Failed to generate verification code.' }, { status: 500 });
    }
}