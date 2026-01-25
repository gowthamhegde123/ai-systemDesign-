import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Mock profile data - in a real app, this would be stored in a database
const mockProfiles: Record<string, any> = {
  'default': {
    name: 'System Architect',
    role: 'Senior System Design Engineer',
    location: 'San Francisco, CA',
    bio: 'Passionate system architect with 8+ years of experience designing scalable distributed systems. Love solving complex problems and building high-performance applications.',
    avatar: '',
    socialLinks: {
      github: 'https://github.com/gowthamhegde123',
      twitter: 'https://twitter.com/gowthamhegde',
      linkedin: 'https://linkedin.com/in/gowthamhegde',
      website: 'https://gowthamhegde.dev'
    }
  }
};

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real app, you would query the database by user ID
    const userId = session.user?.email || 'default';
    const profile = mockProfiles[userId] || mockProfiles['default'];

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
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profileData = await request.json();
    
    // Validate required fields
    if (!profileData.name || !profileData.role) {
      return NextResponse.json({ error: 'Name and role are required' }, { status: 400 });
    }

    // In a real app, you would save to the database
    const userId = session.user?.email || 'default';
    mockProfiles[userId] = {
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: mockProfiles[userId]
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}