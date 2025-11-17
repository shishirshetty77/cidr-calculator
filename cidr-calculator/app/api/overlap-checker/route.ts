
import { NextResponse } from 'next/server';
import { checkCidrOverlap } from '@/utils/ipMath';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cidrList } = body;

    if (!cidrList || !Array.isArray(cidrList)) {
      return NextResponse.json({ error: 'cidrList parameter must be an array of strings.' }, { status: 400 });
    }

    const result = checkCidrOverlap(cidrList);

    if ('error' in result) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}
