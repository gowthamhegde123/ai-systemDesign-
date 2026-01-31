import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all problems
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const difficulty = searchParams.get('difficulty');
        const category = searchParams.get('category');
        const tag = searchParams.get('tag');
        const limit = searchParams.get('limit');
        const offset = searchParams.get('offset');

        let query = supabase
            .from('problems')
            .select(`
                id,
                title,
                slug,
                description,
                difficulty,
                category,
                tags,
                estimated_time,
                points,
                acceptance_rate,
                is_premium,
                created_at
            `)
            .eq('is_active', true);

        // Apply filters
        if (difficulty) {
            query = query.eq('difficulty', difficulty);
        }
        if (category) {
            query = query.eq('category', category);
        }
        if (tag) {
            query = query.contains('tags', [tag]);
        }

        // Apply pagination
        if (limit) {
            query = query.limit(parseInt(limit));
        }
        if (offset) {
            query = query.range(parseInt(offset), parseInt(offset) + (limit ? parseInt(limit) : 10) - 1);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ problems: data || [] });
    } catch (error) {
        console.error('Problems fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 });
    }
}

// GET problem by slug
export async function POST(req: Request) {
    try {
        const { slug } = await req.json();

        if (!slug) {
            return NextResponse.json({ error: 'Problem slug required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('problems')
            .select(`
                id,
                title,
                slug,
                description,
                difficulty,
                category,
                tags,
                estimated_time,
                points,
                acceptance_rate,
                problem_statement,
                constraints,
                examples,
                hints,
                solution_approach,
                is_premium,
                created_at
            `)
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json({ problem: data });
    } catch (error) {
        console.error('Problem fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch problem' }, { status: 500 });
    }
}