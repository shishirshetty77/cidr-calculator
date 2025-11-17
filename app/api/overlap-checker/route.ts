import { NextRequest, NextResponse } from 'next/server';
import { checkMultipleOverlaps } from '@/utils/ipMath';

export async function POST(request: NextRequest) {
  try {
    const { cidrs } = await request.json();

    if (!cidrs || !Array.isArray(cidrs) || cidrs.length === 0) {
      return NextResponse.json(
        { error: 'At least one CIDR block is required' },
        { status: 400 }
      );
    }

    const trimmedCIDRs = cidrs.map((c: string) => c.trim()).filter((c: string) => c.length > 0);

    if (trimmedCIDRs.length < 2) {
      return NextResponse.json(
        { error: 'At least two CIDR blocks are required for overlap checking' },
        { status: 400 }
      );
    }

    const result = checkMultipleOverlaps(trimmedCIDRs);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Overlap check failed' },
      { status: 400 }
    );
  }
}
