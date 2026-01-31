'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function OAuthHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      console.log('OAuth Session Data:', {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        provider: (session as any).user?.provider
      });
      
      // Check if user data already exists in localStorage
      const existingData = localStorage.getItem('userProfileData');
      
      if (!existingData) {
        // This is a new OAuth user, save their data
        const userData = {
          id: session.user.email?.split('@')[0] || '1',
          name: session.user.name || 'User',
          username: session.user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user',
          email: session.user.email || '',
          bio: '',
          location: '',
          company: '',
          jobTitle: '',
          profilePicture: session.user.image || null,
          coverImage: null,
          joinedDate: new Date().toISOString().split('T')[0],
          oauthProvider: (session as any).user?.provider || 'google',
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
              username: '',
              displayName: '',
              profileUrl: '',
              isVerified: false,
              isLinked: false,
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
        console.log('OAuth user data saved:', userData);
      } else {
        // User data exists, update OAuth info if needed
        try {
          const existingUserData = JSON.parse(existingData);
          
          // Update OAuth-related fields
          existingUserData.oauthProvider = (session as any).user?.provider || existingUserData.oauthProvider;
          existingUserData.oauthAvatar = session.user.image || existingUserData.oauthAvatar;
          existingUserData.oauthName = session.user.name || existingUserData.oauthName;
          
          // Update email if it's from OAuth
          if (session.user.email) {
            existingUserData.email = session.user.email;
          }
          
          // Update name if it's from OAuth
          if (session.user.name) {
            existingUserData.name = session.user.name;
          }
          
          // Update username if it's from OAuth
          if (session.user.email) {
            existingUserData.username = session.user.email.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '') || existingUserData.username;
          }
          
          // Update profile picture if it's from OAuth and user hasn't set a custom one
          if (session.user.image && !existingUserData.profilePicture?.startsWith('data:')) {
            existingUserData.profilePicture = session.user.image;
          }
          
          localStorage.setItem('userProfileData', JSON.stringify(existingUserData));
          console.log('OAuth user data updated:', existingUserData);
        } catch (error) {
          console.error('Error updating OAuth user data:', error);
        }
      }
    }
  }, [session, status, router]);

  return null; // This component doesn't render anything
}
