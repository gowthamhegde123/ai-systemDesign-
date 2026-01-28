import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  full_name: string;
  total_score: number;
  submission_count: number;
  solved_count: number;
  rank: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Fetch leaderboard data by aggregating submissions
    const { data: leaderboardData, error } = await supabase
      .from('submissions')
      .select(`
        user_id,
        score,
        users!inner (
          id,
          username,
          full_name
        )
      `)
      .order('score', { ascending: false });

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      );
    }

    // Aggregate scores by user
    const userScores: Record<string, {
      user_id: string;
      username: string;
      full_name: string;
      total_score: number;
      submission_count: number;
    }> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    leaderboardData?.forEach((submission: any) => {
      const userId = submission.user_id;
      const user = Array.isArray(submission.users) ? submission.users[0] : submission.users;
      if (!userScores[userId]) {
        userScores[userId] = {
          user_id: userId,
          username: user?.username || 'Unknown',
          full_name: user?.full_name || 'Unknown User',
          total_score: 0,
          submission_count: 0
        };
      }
      userScores[userId].total_score += submission.score || 0;
      userScores[userId].submission_count += 1;
    });

    // Get solved counts from user_progress
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('user_id');

    const solvedCounts: Record<string, number> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    progressData?.forEach((progress: any) => {
      solvedCounts[progress.user_id] = (solvedCounts[progress.user_id] || 0) + 1;
    });

    // Convert to array and sort by total score
    const leaderboard: LeaderboardEntry[] = Object.values(userScores)
      .map((user, index) => ({
        ...user,
        solved_count: solvedCounts[user.user_id] || 0,
        rank: index + 1
      }))
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, limit)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));

    return NextResponse.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
