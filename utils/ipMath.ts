/**
 * Core IP Math Utilities for CIDR calculations
 * All functions include strict validation for production use
 */

export interface CIDRInfo {
  cidr: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  totalHosts: number;
  usableHosts: number;
  subnetMask: string;
  wildcardMask: string;
  binarySubnetMask: string;
  ipClass: string;
}

export interface SubnetInfo {
  subnet: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  usableHosts: number;
  totalHosts: number;
}

export interface OverlapResult {
  hasOverlaps: boolean;
  overlaps: Array<{
    cidr1: string;
    cidr2: string;
    overlapRange: string;
  }>;
  suggestions: string[];
}

/**
 * Converts an IP address string to a 32-bit integer
 */
export function ipToInt(ip: string): number {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => p < 0 || p > 255 || isNaN(p))) {
    throw new Error(`Invalid IP address: ${ip}`);
  }
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

/**
 * Converts a 32-bit integer to an IP address string
 */
export function intToIp(int: number): string {
  if (int < 0 || int > 0xFFFFFFFF) {
    throw new Error(`Invalid IP integer: ${int}`);
  }
  return [
    (int >>> 24) & 0xFF,
    (int >>> 16) & 0xFF,
    (int >>> 8) & 0xFF,
    int & 0xFF
  ].join('.');
}

/**
 * Validates CIDR notation
 */
export function validateCIDR(cidr: string): boolean {
  const match = cidr.match(/^(\d{1,3}\.){3}\d{1,3}\/(\d{1,2})$/);
  if (!match) return false;
  
  const [ip, prefix] = cidr.split('/');
  const prefixNum = parseInt(prefix);
  
  if (prefixNum < 0 || prefixNum > 32) return false;
  
  try {
    ipToInt(ip);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates IP address
 */
export function validateIP(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = parseInt(part);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

/**
 * Converts prefix length to subnet mask
 */
export function prefixToMask(prefix: number): string {
  if (prefix < 0 || prefix > 32) {
    throw new Error(`Invalid prefix: ${prefix}`);
  }
  const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
  return intToIp(mask);
}

/**
 * Converts subnet mask to prefix length
 */
export function maskToPrefix(mask: string): number {
  const maskInt = ipToInt(mask);
  let prefix = 0;
  let testMask = maskInt;
  
  while (testMask & 0x80000000) {
    prefix++;
    testMask = (testMask << 1) >>> 0;
  }
  
  // Validate it's a valid subnet mask (contiguous 1s)
  const expectedMask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
  if (maskInt !== expectedMask) {
    throw new Error(`Invalid subnet mask: ${mask}`);
  }
  
  return prefix;
}

/**
 * Converts subnet mask to wildcard mask
 */
export function maskToWildcard(mask: string): string {
  const maskInt = ipToInt(mask);
  const wildcardInt = (~maskInt) >>> 0;
  return intToIp(wildcardInt);
}

/**
 * Converts wildcard mask to subnet mask
 */
export function wildcardToMask(wildcard: string): string {
  const wildcardInt = ipToInt(wildcard);
  const maskInt = (~wildcardInt) >>> 0;
  return intToIp(maskInt);
}

/**
 * Converts integer to binary string
 */
export function intToBinary(num: number): string {
  return (num >>> 0).toString(2).padStart(32, '0');
}

/**
 * Formats binary as dotted notation
 */
export function binaryToOctetString(binary: string): string {
  return binary.match(/.{8}/g)?.join('.') || '';
}

/**
 * Determines IP class
 */
export function getIPClass(ip: string): string {
  const firstOctet = parseInt(ip.split('.')[0]);
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
  if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reserved)';
  return 'Unknown';
}

/**
 * Main function: CIDR to IP Range with complete information
 */
export function cidrToRange(cidr: string): CIDRInfo {
  if (!validateCIDR(cidr)) {
    throw new Error(`Invalid CIDR notation: ${cidr}`);
  }

  const [ip, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr);
  
  const ipInt = ipToInt(ip);
  const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
  
  const networkInt = (ipInt & mask) >>> 0;
  const broadcastInt = (networkInt | (~mask >>> 0)) >>> 0;
  
  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix === 32 ? 1 : (prefix === 31 ? 2 : totalHosts - 2);
  
  const firstUsableInt = prefix === 32 ? networkInt : (prefix === 31 ? networkInt : networkInt + 1);
  const lastUsableInt = prefix === 32 ? networkInt : (prefix === 31 ? broadcastInt : broadcastInt - 1);
  
  const subnetMask = prefixToMask(prefix);
  const wildcardMask = maskToWildcard(subnetMask);
  const binaryMask = intToBinary(mask);

  return {
    cidr,
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    firstUsable: intToIp(firstUsableInt),
    lastUsable: intToIp(lastUsableInt),
    totalHosts,
    usableHosts,
    subnetMask,
    wildcardMask,
    binarySubnetMask: binaryToOctetString(binaryMask),
    ipClass: getIPClass(intToIp(networkInt))
  };
}

/**
 * Converts IP range to optimal CIDR blocks
 */
export function rangeToCIDR(startIP: string, endIP: string): string[] {
  if (!validateIP(startIP) || !validateIP(endIP)) {
    throw new Error('Invalid IP addresses');
  }

  let start = ipToInt(startIP);
  const end = ipToInt(endIP);

  if (start > end) {
    throw new Error('Start IP must be less than or equal to end IP');
  }

  const cidrs: string[] = [];

  while (start <= end) {
    let maxSize = 32;
    
    // Find the largest prefix that starts at current position
    while (maxSize > 0) {
      const mask = (0xFFFFFFFF << (32 - maxSize)) >>> 0;
      const networkInt = (start & mask) >>> 0;
      if (networkInt !== start) break;
      
      const broadcastInt = (networkInt | (~mask >>> 0)) >>> 0;
      if (broadcastInt > end) break;
      
      maxSize--;
    }
    maxSize++;

    const blockSize = Math.pow(2, 32 - maxSize);
    cidrs.push(`${intToIp(start)}/${maxSize}`);
    start += blockSize;
  }

  return cidrs;
}

/**
 * Subnetting: divide network by number of subnets needed
 */
export function subnetByCount(networkCIDR: string, subnetCount: number): SubnetInfo[] {
  if (!validateCIDR(networkCIDR)) {
    throw new Error(`Invalid CIDR: ${networkCIDR}`);
  }

  if (subnetCount < 1) {
    throw new Error('Subnet count must be at least 1');
  }

  const [, currentPrefix] = networkCIDR.split('/');
  const prefix = parseInt(currentPrefix);
  
  // Calculate required bits for subnets
  const bitsNeeded = Math.ceil(Math.log2(subnetCount));
  const newPrefix = prefix + bitsNeeded;

  if (newPrefix > 32) {
    throw new Error(`Cannot create ${subnetCount} subnets from /${prefix} network`);
  }

  const info = cidrToRange(networkCIDR);
  const networkInt = ipToInt(info.networkAddress);
  const subnetSize = Math.pow(2, 32 - newPrefix);

  const subnets: SubnetInfo[] = [];
  
  for (let i = 0; i < subnetCount; i++) {
    const subnetNetworkInt = networkInt + (i * subnetSize);
    const subnetBroadcastInt = subnetNetworkInt + subnetSize - 1;
    
    const totalHosts = subnetSize;
    const usableHosts = newPrefix === 32 ? 1 : (newPrefix === 31 ? 2 : totalHosts - 2);
    const firstUsable = newPrefix === 32 ? subnetNetworkInt : (newPrefix === 31 ? subnetNetworkInt : subnetNetworkInt + 1);
    const lastUsable = newPrefix === 32 ? subnetNetworkInt : (newPrefix === 31 ? subnetBroadcastInt : subnetBroadcastInt - 1);

    subnets.push({
      subnet: `${intToIp(subnetNetworkInt)}/${newPrefix}`,
      networkAddress: intToIp(subnetNetworkInt),
      broadcastAddress: intToIp(subnetBroadcastInt),
      firstUsable: intToIp(firstUsable),
      lastUsable: intToIp(lastUsable),
      usableHosts,
      totalHosts
    });
  }

  return subnets;
}

/**
 * Subnetting: divide network by minimum hosts per subnet
 */
export function subnetByHosts(networkCIDR: string, hostsPerSubnet: number): SubnetInfo[] {
  if (!validateCIDR(networkCIDR)) {
    throw new Error(`Invalid CIDR: ${networkCIDR}`);
  }

  if (hostsPerSubnet < 1) {
    throw new Error('Hosts per subnet must be at least 1');
  }

  // Calculate required host bits
  const hostBitsNeeded = Math.ceil(Math.log2(hostsPerSubnet + 2)); // +2 for network and broadcast
  const newPrefix = 32 - hostBitsNeeded;

  const [, currentPrefix] = networkCIDR.split('/');
  const prefix = parseInt(currentPrefix);

  if (newPrefix < prefix) {
    throw new Error(`Cannot create subnets with ${hostsPerSubnet} hosts from /${prefix} network`);
  }

  const info = cidrToRange(networkCIDR);
  const networkInt = ipToInt(info.networkAddress);
  const broadcastInt = ipToInt(info.broadcastAddress);
  const subnetSize = Math.pow(2, 32 - newPrefix);

  const subnets: SubnetInfo[] = [];
  let currentSubnetInt = networkInt;

  while (currentSubnetInt <= broadcastInt) {
    const subnetBroadcastInt = currentSubnetInt + subnetSize - 1;
    
    if (subnetBroadcastInt > broadcastInt) break;

    const totalHosts = subnetSize;
    const usableHosts = newPrefix === 32 ? 1 : (newPrefix === 31 ? 2 : totalHosts - 2);
    const firstUsable = newPrefix === 32 ? currentSubnetInt : (newPrefix === 31 ? currentSubnetInt : currentSubnetInt + 1);
    const lastUsable = newPrefix === 32 ? currentSubnetInt : (newPrefix === 31 ? subnetBroadcastInt : subnetBroadcastInt - 1);

    subnets.push({
      subnet: `${intToIp(currentSubnetInt)}/${newPrefix}`,
      networkAddress: intToIp(currentSubnetInt),
      broadcastAddress: intToIp(subnetBroadcastInt),
      firstUsable: intToIp(firstUsable),
      lastUsable: intToIp(lastUsable),
      usableHosts,
      totalHosts
    });

    currentSubnetInt += subnetSize;
  }

  return subnets;
}

/**
 * Check if two CIDR blocks overlap
 */
export function checkOverlap(cidr1: string, cidr2: string): boolean {
  if (!validateCIDR(cidr1) || !validateCIDR(cidr2)) {
    return false;
  }

  const info1 = cidrToRange(cidr1);
  const info2 = cidrToRange(cidr2);

  const start1 = ipToInt(info1.networkAddress);
  const end1 = ipToInt(info1.broadcastAddress);
  const start2 = ipToInt(info2.networkAddress);
  const end2 = ipToInt(info2.broadcastAddress);

  return !(end1 < start2 || end2 < start1);
}

/**
 * Check multiple CIDRs for overlaps
 */
export function checkMultipleOverlaps(cidrs: string[]): OverlapResult {
  const validCIDRs = cidrs.filter(validateCIDR);
  
  if (validCIDRs.length !== cidrs.length) {
    throw new Error('Invalid CIDR blocks detected');
  }

  const overlaps: Array<{cidr1: string; cidr2: string; overlapRange: string}> = [];
  const suggestions: string[] = [];

  for (let i = 0; i < validCIDRs.length; i++) {
    for (let j = i + 1; j < validCIDRs.length; j++) {
      if (checkOverlap(validCIDRs[i], validCIDRs[j])) {
        const info1 = cidrToRange(validCIDRs[i]);
        const info2 = cidrToRange(validCIDRs[j]);
        
        const start1 = ipToInt(info1.networkAddress);
        const end1 = ipToInt(info1.broadcastAddress);
        const start2 = ipToInt(info2.networkAddress);
        const end2 = ipToInt(info2.broadcastAddress);

        const overlapStart = Math.max(start1, start2);
        const overlapEnd = Math.min(end1, end2);

        overlaps.push({
          cidr1: validCIDRs[i],
          cidr2: validCIDRs[j],
          overlapRange: `${intToIp(overlapStart)} - ${intToIp(overlapEnd)}`
        });

        suggestions.push(
          `Consider using non-overlapping ranges or consolidating ${validCIDRs[i]} and ${validCIDRs[j]} into a larger supernet.`
        );
      }
    }
  }

  return {
    hasOverlaps: overlaps.length > 0,
    overlaps,
    suggestions: [...new Set(suggestions)]
  };
}
