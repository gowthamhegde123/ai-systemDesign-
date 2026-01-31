import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET user progress
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Get user progress with problem details
        const { data: progress, error } = await supabase
            .from('user_progress')
            .select(`
                *,
                problems:problem_id (
                    id,
                    title,
                    slug,
                    difficulty,
                    category,
                    points
                )
            `)
            .eq('user_id', userId)
            .order('last_attempt_at', { ascending: false });

        if (error) throw error;

        // Get user stats
        const { data: userStats, error: statsError } = await supabase
            .from('users')
            .select('problems_solved, total_submissions, points, streak_days, max_streak')
            .eq('id', userId)
            .single();

        if (statsError) throw statsError;

        return NextResponse.json({ 
            progress: progress || [],
            stats: userStats
        });
    } catch (error) {
        console.error('Progress fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }
}

// POST update problem progress
export async function POST(req: Request) {
    try {
        const { userId, problemId, status, score, timeSpent } = await req.json();

        if (!userId || !problemId || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const updateData: any = {
            user_id: userId,
            problem_id: problemId,
            status,
            last_attempt_at: new Date().toISOString()
        };

        if (score !== undefined) {
            updateData.best_score = score;
        }
        if (timeSpent !== undefined) {
            updateData.time_spent = timeSpent;
        }
        if (status === 'solved') {
            updateData.solved_at = new Date().toISOString();
        }

        // Upsert progress record
        const { data, error } = await supabase
            .from('user_progress')
            .upsert(updateData, { 
                onConflict: 'user_id,problem_id',
                ignoreDuplicates: false 
            })
            .select()
            .single();

        if (error) throw error;

        // Update attempts count
        await supabase
            .from('user_progress')
            .update({ attempts: supabase.rpc('increment_attempts') })
            .eq('user_id', userId)
            .eq('problem_id', problemId);

        return NextResponse.json({ 
            message: 'Progress updated successfully', 
            progress: data 
        });
    } catch (error) {
        console.error('Progress update error:', error);
        return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
    }
}