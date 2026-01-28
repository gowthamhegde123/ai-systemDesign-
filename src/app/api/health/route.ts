import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check Supabase connection
    const { error: supabaseError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    const supabaseStatus = supabaseError ? 'error' : 'connected';

    // Check Express backend if configured
    let backendStatus = 'not_configured';
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    
    if (backendUrl) {
      try {
        const response = await fetch(`${backendUrl}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        backendStatus = response.ok ? 'connected' : 'error';
      } catch {
        backendStatus = 'unreachable';
      }
    }

    return NextResponse.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        frontend: 'running',
        supabase: supabaseStatus,
        backend: backendStatus
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, { status: 500 });
  }
}
