import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { supabase } from '@/lib/supabase';

// Interface for profile data
interface ProfileData {
    name: string;
    role: string;
    location?: string;
    bio?: string;
    avatar?: string;
    socialLinks?: {
        github?: string;
        twitter?: string;
        linkedin?: string;
        website?: string;
    };
    updatedAt?: string;
}

// Default profile for new users
const defaultProfile: ProfileData = {
    name: 'System Architect',
    role: 'System Design Engineer',
    location: '',
    bio: '',
    avatar: '',
    socialLinks: {
      github: '',
      twitter: '',
      linkedin: '',
      website: ''
    }
};

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user profile from Supabase database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, username, bio, location, avatar_url, github_url, twitter_url, linkedin_url, website_url, role, updated_at')
      .eq('email', session.user.email)
      .single();

    if (error || !user) {
      // Return default profile if user not found in database
      return NextResponse.json({
        ...defaultProfile,
        name: session.user.name || defaultProfile.name
      });
    }

    // Transform database fields to profile format
    const profile: ProfileData = {
      name: user.full_name || session.user.name || defaultProfile.name,
      role: user.role || defaultProfile.role,
      location: user.location || '',
      bio: user.bio || '',
      avatar: user.avatar_url || session.user.image || '',
      socialLinks: {
        github: user.github_url || '',
        twitter: user.twitter_url || '',
        linkedin: user.linkedin_url || '',
        website: user.website_url || ''
      },
      updatedAt: user.updated_at
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profileData = await request.json();
    
    // Validate required fields
    if (!profileData.name || !profileData.role) {
      return NextResponse.json({ error: 'Name and role are required' }, { status: 400 });
    }

    // First check if user exists in the database
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    // Prepare update data
    const updateData = {
      full_name: profileData.name,
      role: profileData.role,
      bio: profileData.bio || '',
      location: profileData.location || '',
      avatar_url: profileData.avatar || '',
      github_url: profileData.socialLinks?.github || '',
      twitter_url: profileData.socialLinks?.twitter || '',
      linkedin_url: profileData.socialLinks?.linkedin || '',
      website_url: profileData.socialLinks?.website || '',
      updated_at: new Date().toISOString()
    };

    let result;
    
    if (existingUser) {
      // Update existing user
      result = await supabase
        .from('users')
        .update(updateData)
        .eq('email', session.user.email)
        .select()
        .single();
    } else {
      // Create new user profile
      result = await supabase
        .from('users')
        .insert({
          email: session.user.email,
          username: session.user.email?.split('@')[0] + Math.floor(Math.random() * 1000),
          ...updateData
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        ...profileData,
        updatedAt: updateData.updated_at
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}