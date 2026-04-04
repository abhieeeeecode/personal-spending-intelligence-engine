import { NextRequest, NextResponse } from 'next/server';
import { comparePrices, quickSearch, fullSearch } from '@/lib/comparison-engine';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const mode = searchParams.get('mode') || 'quick'; // quick, full, cached
  
  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }
  
  try {
    let result;
    
    switch (mode) {
      case 'full':
        result = await fullSearch(query);
        break;
      case 'cached':
        result = await comparePrices(query, { useCache: true, timeout: 1000 });
        break;
      case 'quick':
      default:
        result = await quickSearch(query);
        break;
    }
    
    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        query,
        mode,
        fetchedAt: new Date().toISOString(),
        platformCount: result.options.length,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch prices',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, platforms, timeout = 3000 } = body;
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    const result = await comparePrices(query, {
      timeout,
      useCache: true,
    });
    
    // Filter to specific platforms if requested
    if (platforms && Array.isArray(platforms)) {
      result.options = result.options.filter(o => 
        platforms.includes(o.platform.id)
      );
    }
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch prices',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
