import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email, password, fullName, username } = await req.json();

        if (!email || !password || !fullName || !username) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Check if email or username exists
        const { data: existingEmail } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingEmail) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        const { data: existingUsername } = await supabase
            .from('users')
            .select('id')
            .eq('username', username)
            .single();

        if (existingUsername) {
            return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const { data, error } = await supabase
            .from('users')
            .insert({
                email,
                password: hashedPassword,
                full_name: fullName,
                username,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ message: 'User created successfully', user: data });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
    }
}
