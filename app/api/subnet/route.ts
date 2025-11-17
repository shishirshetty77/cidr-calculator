import { NextRequest, NextResponse } from 'next/server';
import { subnetByCount, subnetByHosts } from '@/utils/ipMath';

export async function POST(request: NextRequest) {
  try {
    const { networkCIDR, mode, value } = await request.json();

    if (!networkCIDR || !mode || !value) {
      return NextResponse.json(
        { error: 'Network CIDR, mode, and value are required' },
        { status: 400 }
      );
    }

    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      return NextResponse.json(
        { error: 'Value must be a positive number' },
        { status: 400 }
      );
    }

    let result;
    if (mode === 'subnets') {
      result = subnetByCount(networkCIDR.trim(), numValue);
    } else if (mode === 'hosts') {
      result = subnetByHosts(networkCIDR.trim(), numValue);
    } else {
      return NextResponse.json(
        { error: 'Mode must be either "subnets" or "hosts"' },
        { status: 400 }
      );
    }

    return NextResponse.json({ subnets: result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Subnetting failed' },
      { status: 400 }
    );
  }
}
