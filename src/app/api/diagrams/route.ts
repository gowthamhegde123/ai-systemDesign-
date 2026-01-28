import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { supabase } from '@/lib/supabase';

// GET - List all diagrams for the current user
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
      return NextResponse.json({ 
        success: true, 
        data: [] 
      });
    }

    // Fetch user's diagrams from the database
    const { data: diagrams, error } = await supabase
      .from('diagrams')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching diagrams:', error);
      return NextResponse.json(
        { error: 'Failed to fetch diagrams' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: diagrams || []
    });
  } catch (error) {
    console.error('Error fetching diagrams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diagrams' },
      { status: 500 }
    );
  }
}

// POST - Create a new diagram
export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, problem_id, diagram_data } = body;

    if (!diagram_data) {
      return NextResponse.json(
        { error: 'Diagram data is required' },
        { status: 400 }
      );
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

    // Create the diagram
    const { data: diagram, error } = await supabase
      .from('diagrams')
      .insert({
        user_id: user.id,
        name: name || 'Untitled Diagram',
        problem_id: problem_id || null,
        diagram_data: diagram_data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating diagram:', error);
      return NextResponse.json(
        { error: 'Failed to create diagram' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Diagram created successfully',
      data: diagram
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating diagram:', error);
    return NextResponse.json(
      { error: 'Failed to create diagram' },
      { status: 500 }
    );
  }
}
