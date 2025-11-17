import { NextRequest, NextResponse } from 'next/server';
import { rangeToCIDR } from '@/utils/ipMath';

export async function POST(request: NextRequest) {
  try {
    const { startIP, endIP } = await request.json();

    if (!startIP || !endIP) {
      return NextResponse.json(
        { error: 'Start IP and End IP are required' },
        { status: 400 }
      );
    }

    const result = rangeToCIDR(startIP.trim(), endIP.trim());
    return NextResponse.json({ cidrs: result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid IP range' },
      { status: 400 }
    );
  }
}
