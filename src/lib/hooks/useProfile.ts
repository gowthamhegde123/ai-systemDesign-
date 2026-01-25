import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface ProfileData {
  name: string;
  role: string;
  location: string;
  bio: string;
  avatar: string;
  socialLinks: {
    github: string;
    twitter: string;
    linkedin: string;
    website: string;
  };
}

export const useProfile = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        // Set default profile data if none exists
        setProfile({
          name: session?.user?.name || 'System Architect',
          role: 'Senior System Design Engineer',
          location: 'San Francisco, CA',
          bio: 'Passionate system architect with experience designing scalable distributed systems.',
          avatar: session?.user?.image || '',
          socialLinks: {
            github: '',
            twitter: '',
            linkedin: '',
            website: ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: ProfileData) => {
    if (!session) return false;

    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        setProfile(profileData);
        return true;
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
    return false;
  };

  return {
    profile,
    loading,
    saving,
    saveProfile,
    refetch: fetchProfile,
  };
};