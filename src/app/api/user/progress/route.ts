import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Mock user progress data - in a real app, this would be stored in a database
const mockUserProgress = {
  solvedQuestions: [
    'distributed-cache',
    'load-balancer',
    'flash-sale',
    'image-service',
    'hashtag-service',
    'user-affinity',
    'online-offline-indicator',
    'realtime-claps',
    'text-search-engine',
    'recent-searches',
    'word-dictionary',
    'blogging-platform',
    'video-pipeline',
    'near-me',
    'file-sync',
    'onepic',
    'airline-checkin',
    'counting-impressions'
  ],
  solvedDates: {
    'distributed-cache': '2024-01-15',
    'load-balancer': '2024-01-16',
    'flash-sale': '2024-01-18',
    'image-service': '2024-01-20',
    'hashtag-service': '2024-01-22',
    'user-affinity': '2024-01-25',
    'online-offline-indicator': '2024-01-28',
    'realtime-claps': '2024-02-01',
    'text-search-engine': '2024-02-05',
    'recent-searches': '2024-02-08',
    'word-dictionary': '2024-02-12',
    'blogging-platform': '2024-02-15',
    'video-pipeline': '2024-02-18',
    'near-me': '2024-02-22',
    'file-sync': '2024-02-25',
    'onepic': '2024-02-28',
    'airline-checkin': '2024-03-02',
    'counting-impressions': '2024-03-05',
    // Recent activity for current month to show levels
    'sql-kv': '2026-01-20',
    'queue-consumers': '2026-01-21',
    'realtime-db': '2026-01-21',
    'task-scheduler': '2026-01-23',
    'distributed-locking': '2026-01-23',
    'search-autocomplete': '2026-01-23',
    'api-gateway': '2026-01-25',
    'global-id-gen': '2026-01-25',
    'metrics-service': '2026-01-25',
    'distributed-tracing': '2026-01-25',
    // Activity for 2025 to show it in selector
    'web-server-base': '2025-03-12',
    'lb-config': '2025-03-13',
    'cdn-setup': '2025-07-20',
    'security-waf': '2025-07-20',
    'monitoring-dash': '2025-11-05'
  },
  currentStreak: 12,
  longestStreak: 18,
  totalSolved: 33
};

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // MULTI-USER SUPPORT: In a production app, you would fetch progress 
    // from a database using the user's email:
    // const userProgress = await db.progress.findUnique({ where: { email: session.user.email } });

    return NextResponse.json(mockUserProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
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

    const { questionId } = await request.json();

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    // In a real app, you would update the database here
    // For now, we'll just return success
    const today = new Date().toISOString().split('T')[0];

    return NextResponse.json({
      success: true,
      questionId,
      solvedDate: today,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}