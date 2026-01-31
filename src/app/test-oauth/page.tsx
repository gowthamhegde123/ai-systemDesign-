'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function TestOAuthPage() {
  const { data: session, status } = useSession();
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('userProfileData');
    if (data) {
      setLocalStorageData(JSON.parse(data));
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-foreground">OAuth Test Page</h1>
        
        {/* Session Data */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Session Data</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Status:</strong> {status}</p>
            {session?.user && (
              <>
                <p><strong>Name:</strong> {session.user.name || 'Not provided'}</p>
                <p><strong>Email:</strong> {session.user.email || 'Not provided'}</p>
                <p><strong>Image:</strong> {session.user.image ? 'Yes' : 'No'}</p>
                {session.user.image && (
                  <img src={session.user.image} alt="Profile" className="w-16 h-16 rounded-full" />
                )}
              </>
            )}
          </div>
        </div>

        {/* localStorage Data */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">localStorage Data</h2>
          {localStorageData ? (
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {localStorageData.name}</p>
              <p><strong>Username:</strong> {localStorageData.username}</p>
              <p><strong>Email:</strong> {localStorageData.email}</p>
              <p><strong>Profile Picture:</strong> {localStorageData.profilePicture ? 'Yes' : 'No'}</p>
              <p><strong>OAuth Provider:</strong> {localStorageData.oauthProvider || 'None'}</p>
              <p><strong>OAuth Name:</strong> {localStorageData.oauthName || 'None'}</p>
              <p><strong>OAuth Avatar:</strong> {localStorageData.oauthAvatar ? 'Yes' : 'No'}</p>
              {localStorageData.profilePicture && (
                <img src={localStorageData.profilePicture} alt="Profile" className="w-16 h-16 rounded-full" />
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No data in localStorage</p>
          )}
        </div>

        {/* Raw Data */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Raw Data (JSON)</h2>
          <pre className="bg-muted p-4 rounded text-xs overflow-auto">
            {JSON.stringify({ session, localStorageData }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
