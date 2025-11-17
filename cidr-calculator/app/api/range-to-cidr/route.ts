
import { NextResponse } from 'next/server';
import { getCidrFromRange } from '@/utils/ipMath';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startIp = searchParams.get('start');
  const endIp = searchParams.get('end');

  if (!startIp || !endIp) {
    return NextResponse.json({ error: 'Start and End IP parameters are required' }, { status: 400 });
  }

  const result = getCidrFromRange(startIp, endIp);

  if ('error' in result) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
