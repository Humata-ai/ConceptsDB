import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      return NextResponse.json(
        { error: 'SUPABASE_PROJECT_URL or SUPABASE_SECRET_KEY not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Execute a simple SQL query to verify connection
    const { data, error } = await supabase.rpc('version');

    // If the RPC call fails (function doesn't exist), that's okay -
    // the connection itself worked, we just need to create the function
    if (error && !error.message.includes('Could not find the function')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: 'Database query failed'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful! Supabase client is properly configured.',
      note: error ? 'Function version() not found, but connection is working' : 'Query executed successfully',
      result: data || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to connect to database'
      },
      { status: 500 }
    );
  }
}
