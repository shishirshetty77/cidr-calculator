
import { NextResponse } from 'next/server';
import { calculateSubnetsBySubnetCount, calculateSubnetsByHostCount } from '@/utils/ipMath';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { networkCidr, calculateBy, value } = body;

    if (!networkCidr || !calculateBy || value === undefined) {
      return NextResponse.json({ error: 'Missing required parameters: networkCidr, calculateBy, value' }, { status: 400 });
    }

    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue <= 0) {
        return NextResponse.json({ error: 'Value must be a positive number.' }, { status: 400 });
    }

    let result;
    if (calculateBy === 'subnetCount') {
      result = calculateSubnetsBySubnetCount(networkCidr, numericValue);
    } else if (calculateBy === 'hostCount') {
      result = calculateSubnetsByHostCount(networkCidr, numericValue);
    } else {
      return NextResponse.json({ error: 'Invalid calculation method. Use "subnetCount" or "hostCount".' }, { status: 400 });
    }

    if ('error' in result) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}
