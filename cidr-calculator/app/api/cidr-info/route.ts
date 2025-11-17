
import { NextResponse } from 'next/server';
import { getCidrInfo } from '@/utils/ipMath';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cidr = searchParams.get('cidr');

  if (!cidr) {
    return NextResponse.json({ error: 'CIDR parameter is required' }, { status: 400 });
  }

  const result = getCidrInfo(cidr);

  if ('error' in result) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
