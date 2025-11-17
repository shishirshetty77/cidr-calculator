import { NextRequest, NextResponse } from 'next/server';
import { cidrToRange } from '@/utils/ipMath';

export async function POST(request: NextRequest) {
  try {
    const { cidr } = await request.json();

    if (!cidr || typeof cidr !== 'string') {
      return NextResponse.json(
        { error: 'CIDR notation is required' },
        { status: 400 }
      );
    }

    const result = cidrToRange(cidr.trim());
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid CIDR notation' },
      { status: 400 }
    );
  }
}
