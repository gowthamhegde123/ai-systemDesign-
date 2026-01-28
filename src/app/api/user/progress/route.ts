import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { supabase } from '@/lib/supabase';

// Interface for user progress data
interface UserProgress {
  solvedQuestions: string[];
  solvedDates: Record<string, string>;
  currentStreak: number;
  longestStreak: number;
  totalSolved: number;
}

// Calculate streak from solved dates
function calculateStreak(solvedDates: Record<string, string>): { currentStreak: number; longestStreak: number } {
  const dates = Object.values(solvedDates)
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime()); // Sort descending

  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const mostRecent = new Date(dates[0]);
  mostRecent.setHours(0, 0, 0, 0);
  
  // Check if the most recent activity is today or yesterday
  const diffDays = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) {
    currentStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);
      
      const diff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        currentStreak++;
        tempStreak++;
      } else if (diff > 1) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
  } else {
    // Calculate longest streak from history
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);
      
      const diff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        tempStreak++;
      } else if (diff > 1) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  return { currentStreak, longestStreak };
}

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      // Return empty progress for new users
      return NextResponse.json({
        solvedQuestions: [],
        solvedDates: {},
        currentStreak: 0,
        longestStreak: 0,
        totalSolved: 0
      });
    }

    // Fetch user's progress from the database
    const { data: progressData, error } = await supabase
      .from('user_progress')
      .select('question_id, solved_at')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching progress:', error);
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      );
    }

    // Transform database data to progress format
    const solvedQuestions: string[] = [];
    const solvedDates: Record<string, string> = {};

    if (progressData) {
      progressData.forEach((item: { question_id: string; solved_at: string }) => {
        solvedQuestions.push(item.question_id);
        solvedDates[item.question_id] = item.solved_at;
      });
    }

    const { currentStreak, longestStreak } = calculateStreak(solvedDates);

    const progress: UserProgress = {
      solvedQuestions,
      solvedDates,
      currentStreak,
      longestStreak,
      totalSolved: solvedQuestions.length
    };

    return NextResponse.json(progress);
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

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questionId } = await request.json();

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    // Get user ID from email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const today = new Date().toISOString();

    // Check if already solved
    const { data: existing } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_id', questionId)
      .single();

    if (existing) {
      // Update existing record
      await supabase
        .from('user_progress')
        .update({ solved_at: today })
        .eq('id', existing.id);
    } else {
      // Insert new progress record
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          question_id: questionId,
          solved_at: today
        });

      if (error) {
        console.error('Error saving progress:', error);
        return NextResponse.json(
          { error: 'Failed to save progress' },
          { status: 500 }
        );
      }
    }

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