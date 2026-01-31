import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET user profile
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const username = searchParams.get('username');

        if (!userId && !username) {
            return NextResponse.json({ error: 'User ID or username required' }, { status: 400 });
        }

        let query = supabase
            .from('users')
            .select(`
                id,
                username,
                display_name,
                full_name,
                bio,
                profile_picture_url,
                cover_image_url,
                location,
                company,
                job_title,
                experience_level,
                github_url,
                twitter_url,
                linkedin_url,
                website_url,
                portfolio_url,
                problems_solved,
                total_submissions,
                points,
                streak_days,
                max_streak,
                last_activity_date,
                public_profile,
                show_stats,
                created_at
            `);

        if (userId) {
            query = query.eq('id', userId);
        } else {
            query = query.eq('username', username);
        }

        const { data, error } = await query.single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json({ user: data });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

// PUT update user profile
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const {
            userId,
            display_name,
            bio,
            profile_picture_url,
            cover_image_url,
            location,
            company,
            job_title,
            experience_level,
            github_url,
            twitter_url,
            linkedin_url,
            website_url,
            portfolio_url,
            public_profile,
            show_stats
        } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const updateData: any = {};
        
        // Only update provided fields
        if (display_name !== undefined) updateData.display_name = display_name;
        if (bio !== undefined) updateData.bio = bio;
        if (profile_picture_url !== undefined) updateData.profile_picture_url = profile_picture_url;
        if (cover_image_url !== undefined) updateData.cover_image_url = cover_image_url;
        if (location !== undefined) updateData.location = location;
        if (company !== undefined) updateData.company = company;
        if (job_title !== undefined) updateData.job_title = job_title;
        if (experience_level !== undefined) updateData.experience_level = experience_level;
        if (github_url !== undefined) updateData.github_url = github_url;
        if (twitter_url !== undefined) updateData.twitter_url = twitter_url;
        if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url;
        if (website_url !== undefined) updateData.website_url = website_url;
        if (portfolio_url !== undefined) updateData.portfolio_url = portfolio_url;
        if (public_profile !== undefined) updateData.public_profile = public_profile;
        if (show_stats !== undefined) updateData.show_stats = show_stats;

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ message: 'Profile updated successfully', user: data });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}