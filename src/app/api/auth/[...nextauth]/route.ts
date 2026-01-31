import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // TODO: Implement your own credential validation
        // For now, return a mock user
        if (credentials?.email && credentials?.password) {
          return {
            id: '1',
            email: credentials.email,
            name: 'User',
            image: null,
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Save user data to localStorage when they sign in
      if (account?.provider === 'google' || account?.provider === 'github') {
        // This will be handled in the session callback
        return true;
      }
      return true;
    },
    async session({ session, token }: any) {
      // Add user info to session
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.provider = token.provider as string;
        
        // Save OAuth user data to localStorage (client-side will handle this)
        if (typeof window !== 'undefined') {
          const userData = {
            id: token.sub,
            name: session.user.name || 'User',
            username: session.user.email?.split('@')[0] || 'user',
            email: session.user.email || '',
            bio: '',
            location: '',
            company: '',
            jobTitle: '',
            profilePicture: session.user.image || null,
            coverImage: null,
            joinedDate: new Date().toISOString().split('T')[0],
            oauthProvider: token.provider,
            oauthAvatar: session.user.image,
            oauthName: session.user.name,
            isOAuthUser: true,
            stats: {
              problemsSolved: 0,
              totalSubmissions: 0,
              points: 0,
              currentStreak: 0,
              maxStreak: 0,
              rank: 'Beginner'
            },
            socialAccounts: [
              {
                platform: 'github',
                username: token.provider === 'github' ? session.user.email?.split('@')[0] : '',
                displayName: '',
                profileUrl: token.provider === 'github' ? `https://github.com/${session.user.email?.split('@')[0]}` : '',
                isVerified: token.provider === 'github',
                isLinked: token.provider === 'github',
                isPublic: true
              },
              {
                platform: 'linkedin',
                username: '',
                displayName: '',
                profileUrl: '',
                isVerified: false,
                isLinked: false,
                isPublic: true
              },
              {
                platform: 'twitter',
                username: '',
                displayName: '',
                profileUrl: '',
                isVerified: false,
                isLinked: false,
                isPublic: true
              },
              {
                platform: 'instagram',
                username: '',
                displayName: '',
                profileUrl: '',
                isVerified: false,
                isLinked: false,
                isPublic: true
              },
              {
                platform: 'website',
                username: '',
                displayName: 'Personal Website',
                profileUrl: '',
                isVerified: false,
                isLinked: false,
                isPublic: true
              },
              {
                platform: 'portfolio',
                username: '',
                displayName: 'Portfolio',
                profileUrl: '',
                isVerified: false,
                isLinked: false,
                isPublic: true
              }
            ],
            preferences: {
              emailNotifications: true,
              pushNotifications: true,
              weeklyDigest: true,
              achievementNotifications: true,
              publicProfile: true,
              showStats: true,
              showActivity: true,
              language: 'en',
              timezone: 'UTC'
            }
          };
          
          localStorage.setItem('userProfileData', JSON.stringify(userData));
        }
      }
      return session;
    },
    async jwt({ token, account, profile }: any) {
      // Add provider info to token
      if (account) {
        token.provider = account.provider;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// @ts-ignore - NextAuth v4 compatibility with App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
