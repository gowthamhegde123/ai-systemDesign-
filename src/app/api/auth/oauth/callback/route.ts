import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth Callback Handler
 * Handles OAuth callbacks from Google, GitHub, LinkedIn
 * Automatically fetches user profile data and creates/updates user account
 */

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const provider = searchParams.get('provider'); // 'google', 'github', 'linkedin'
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!provider || !code) {
    return NextResponse.json(
      { error: 'Missing provider or authorization code' },
      { status: 400 }
    );
  }

  try {
    // Exchange authorization code for access token
    const tokenData = await exchangeCodeForToken(provider, code);
    
    // Fetch user profile from OAuth provider
    const profileData = await fetchOAuthProfile(provider, tokenData.access_token);
    
    // Create or update user in database
    const user = await createOrUpdateUserFromOAuth({
      provider,
      providerId: profileData.id,
      email: profileData.email,
      name: profileData.name,
      username: profileData.username,
      avatarUrl: profileData.avatar_url,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    });

    // Set session cookie
    const response = NextResponse.redirect(new URL('/profile', request.url));
    response.cookies.set('session', user.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=oauth_failed', request.url)
    );
  }
}

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(provider: string, code: string) {
  const configs = {
    google: {
      tokenUrl: 'https://oauth2.googleapis.com/token',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/callback?provider=google`,
    },
    github: {
      tokenUrl: 'https://github.com/login/oauth/access_token',
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/callback?provider=github`,
    },
    linkedin: {
      tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/callback?provider=linkedin`,
    },
  };

  const config = configs[provider as keyof typeof configs];
  if (!config) throw new Error(`Unsupported provider: ${provider}`);

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      client_id: config.clientId!,
      client_secret: config.clientSecret!,
      code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Fetch user profile from OAuth provider
 */
async function fetchOAuthProfile(provider: string, accessToken: string) {
  const endpoints = {
    google: 'https://www.googleapis.com/oauth2/v2/userinfo',
    github: 'https://api.github.com/user',
    linkedin: 'https://api.linkedin.com/v2/me',
  };

  const endpoint = endpoints[provider as keyof typeof endpoints];
  if (!endpoint) throw new Error(`Unsupported provider: ${provider}`);

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Profile fetch failed: ${response.statusText}`);
  }

  const data = await response.json();

  // Normalize profile data across providers
  return {
    id: data.id || data.sub,
    email: data.email,
    name: data.name || data.login,
    username: data.login || data.email?.split('@')[0],
    avatar_url: data.picture || data.avatar_url,
  };
}

/**
 * Create or update user from OAuth data
 * This should integrate with your Supabase database
 */
async function createOrUpdateUserFromOAuth(data: {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string;
  accessToken: string;
  refreshToken?: string;
}) {
  // TODO: Integrate with Supabase
  // Call the create_user_from_oauth function we created in the schema
  
  // For now, return mock data
  return {
    id: '1',
    email: data.email,
    name: data.name,
    username: data.username,
    sessionToken: 'mock-session-token',
  };
}
