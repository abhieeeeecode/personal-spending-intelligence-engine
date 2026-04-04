import { NextRequest, NextResponse } from 'next/server';
import { generateLiveDeals } from '@/lib/decision-engine';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const deals = generateLiveDeals();
    
    return NextResponse.json({
      success: true,
      data: deals,
      meta: {
        count: deals.length,
        fetchedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Deals fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch deals',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
