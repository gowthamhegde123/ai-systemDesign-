import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { supabase } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get a specific diagram by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get user ID from email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch the diagram
    const { data: diagram, error } = await supabase
      .from('diagrams')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !diagram) {
      return NextResponse.json(
        { error: 'Diagram not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: diagram
    });
  } catch (error) {
    console.error('Error fetching diagram:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diagram' },
      { status: 500 }
    );
  }
}

// PUT - Update a diagram
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, problem_id, diagram_data } = body;

    // Get user ID from email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if diagram exists and belongs to user
    const { data: existing } = await supabase
      .from('diagrams')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Diagram not found' },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (problem_id !== undefined) updateData.problem_id = problem_id;
    if (diagram_data !== undefined) updateData.diagram_data = diagram_data;

    // Update the diagram
    const { data: diagram, error } = await supabase
      .from('diagrams')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating diagram:', error);
      return NextResponse.json(
        { error: 'Failed to update diagram' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Diagram updated successfully',
      data: diagram
    });
  } catch (error) {
    console.error('Error updating diagram:', error);
    return NextResponse.json(
      { error: 'Failed to update diagram' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a diagram
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get user ID from email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete the diagram
    const { error } = await supabase
      .from('diagrams')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting diagram:', error);
      return NextResponse.json(
        { error: 'Failed to delete diagram' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Diagram deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting diagram:', error);
    return NextResponse.json(
      { error: 'Failed to delete diagram' },
      { status: 500 }
    );
  }
}
