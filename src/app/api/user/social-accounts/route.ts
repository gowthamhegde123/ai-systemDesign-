import { NextRequest, NextResponse } from 'next/server';

/**
 * Social Accounts API
 * Manage user's linked social media accounts
 */

// GET - Fetch user's social accounts
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user ID from session
    const userId = '1'; // Mock user ID

    // TODO: Fetch from Supabase
    // const { data, error } = await supabase
    //   .from('social_accounts')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .order('display_order');

    // Mock data for now
    const socialAccounts = [
      {
        id: '1',
        platform: 'github',
        username: '',
        displayName: '',
        profileUrl: '',
        isVerified: false,
        isLinked: false,
        isPublic: true,
      },
      {
        id: '2',
        platform: 'linkedin',
        username: '',
        displayName: '',
        profileUrl: '',
        isVerified: false,
        isLinked: false,
        isPublic: true,
      },
      {
        id: '3',
        platform: 'twitter',
        username: '',
        displayName: '',
        profileUrl: '',
        isVerified: false,
        isLinked: false,
        isPublic: true,
      },
      {
        id: '4',
        platform: 'instagram',
        username: '',
        displayName: '',
        profileUrl: '',
        isVerified: false,
        isLinked: false,
        isPublic: true,
      },
      {
        id: '5',
        platform: 'website',
        username: '',
        displayName: 'Personal Website',
        profileUrl: '',
        isVerified: false,
        isLinked: false,
        isPublic: true,
      },
      {
        id: '6',
        platform: 'portfolio',
        username: '',
        displayName: 'Portfolio',
        profileUrl: '',
        isVerified: false,
        isLinked: false,
        isPublic: true,
      },
    ];

    return NextResponse.json({ socialAccounts });
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social accounts' },
      { status: 500 }
    );
  }
}

// POST - Link a new social account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, username, profileUrl, displayName } = body;

    // TODO: Get user ID from session
    const userId = '1'; // Mock user ID

    // Validate required fields
    if (!platform || !profileUrl) {
      return NextResponse.json(
        { error: 'Platform and profile URL are required' },
        { status: 400 }
      );
    }

    // Validate URL format
    if (!isValidUrl(profileUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // TODO: Call Supabase function to link account
    // const { data, error } = await supabase.rpc('link_social_account', {
    //   p_user_id: userId,
    //   p_platform: platform,
    //   p_username: username,
    //   p_profile_url: profileUrl,
    //   p_display_name: displayName,
    // });

    // Mock response
    const newAccount = {
      id: Date.now().toString(),
      userId,
      platform,
      username: username || extractUsernameFromUrl(platform, profileUrl),
      displayName: displayName || username,
      profileUrl,
      isVerified: false,
      isLinked: true,
      isPublic: true,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ account: newAccount }, { status: 201 });
  } catch (error) {
    console.error('Error linking social account:', error);
    return NextResponse.json(
      { error: 'Failed to link social account' },
      { status: 500 }
    );
  }
}

// PATCH - Update a social account
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, profileUrl, displayName, isPublic } = body;

    // TODO: Get user ID from session
    const userId = '1'; // Mock user ID

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // TODO: Update in Supabase
    // const { data, error } = await supabase
    //   .from('social_accounts')
    //   .update({
    //     profile_url: profileUrl,
    //     display_name: displayName,
    //     is_public: isPublic,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('id', accountId)
    //   .eq('user_id', userId);

    return NextResponse.json({ 
      message: 'Social account updated successfully',
      accountId 
    });
  } catch (error) {
    console.error('Error updating social account:', error);
    return NextResponse.json(
      { error: 'Failed to update social account' },
      { status: 500 }
    );
  }
}

// DELETE - Unlink a social account
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    // TODO: Get user ID from session
    const userId = '1'; // Mock user ID

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // TODO: Delete from Supabase
    // const { error } = await supabase
    //   .from('social_accounts')
    //   .delete()
    //   .eq('id', accountId)
    //   .eq('user_id', userId);

    return NextResponse.json({ 
      message: 'Social account unlinked successfully' 
    });
  } catch (error) {
    console.error('Error unlinking social account:', error);
    return NextResponse.json(
      { error: 'Failed to unlink social account' },
      { status: 500 }
    );
  }
}

// Helper functions
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function extractUsernameFromUrl(platform: string, url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    switch (platform) {
      case 'github':
        return pathname.split('/')[1] || '';
      case 'linkedin':
        return pathname.split('/in/')[1]?.replace('/', '') || '';
      case 'twitter':
        return pathname.split('/')[1] || '';
      case 'instagram':
        return pathname.split('/')[1] || '';
      default:
        return urlObj.hostname;
    }
  } catch {
    return '';
  }
}
