import { NextRequest, NextResponse } from 'next/server';
import { 
  validateCIDR, 
  validateIP,
  maskToPrefix, 
  prefixToMask, 
  maskToWildcard, 
  wildcardToMask,
  intToBinary,
  binaryToOctetString,
  ipToInt
} from '@/utils/ipMath';

export async function POST(request: NextRequest) {
  try {
    const { input, type } = await request.json();

    if (!input || !type) {
      return NextResponse.json(
        { error: 'Input and type are required' },
        { status: 400 }
      );
    }

    const trimmedInput = input.trim();
    let prefix: number;
    let subnetMask: string;
    let wildcardMask: string;
    let binaryMask: string;

    if (type === 'cidr') {
      if (!validateCIDR(trimmedInput)) {
        throw new Error('Invalid CIDR notation');
      }
      const [, prefixStr] = trimmedInput.split('/');
      prefix = parseInt(prefixStr);
      subnetMask = prefixToMask(prefix);
      wildcardMask = maskToWildcard(subnetMask);
      const maskInt = ipToInt(subnetMask);
      binaryMask = binaryToOctetString(intToBinary(maskInt));
    } else if (type === 'subnet') {
      if (!validateIP(trimmedInput)) {
        throw new Error('Invalid subnet mask');
      }
      subnetMask = trimmedInput;
      prefix = maskToPrefix(subnetMask);
      wildcardMask = maskToWildcard(subnetMask);
      const maskInt = ipToInt(subnetMask);
      binaryMask = binaryToOctetString(intToBinary(maskInt));
    } else if (type === 'wildcard') {
      if (!validateIP(trimmedInput)) {
        throw new Error('Invalid wildcard mask');
      }
      wildcardMask = trimmedInput;
      subnetMask = wildcardToMask(wildcardMask);
      prefix = maskToPrefix(subnetMask);
      const maskInt = ipToInt(subnetMask);
      binaryMask = binaryToOctetString(intToBinary(maskInt));
    } else if (type === 'prefix') {
      const prefixNum = parseInt(trimmedInput);
      if (isNaN(prefixNum) || prefixNum < 0 || prefixNum > 32) {
        throw new Error('Invalid prefix length (must be 0-32)');
      }
      prefix = prefixNum;
      subnetMask = prefixToMask(prefix);
      wildcardMask = maskToWildcard(subnetMask);
      const maskInt = ipToInt(subnetMask);
      binaryMask = binaryToOctetString(intToBinary(maskInt));
    } else {
      throw new Error('Invalid conversion type');
    }

    return NextResponse.json({
      prefix,
      subnetMask,
      wildcardMask,
      binaryMask,
      cidrNotation: `x.x.x.x/${prefix}`
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Conversion failed' },
      { status: 400 }
    );
  }
}
