
import { Address4 } from 'ip-address';

// --- Feature 1: CIDR to IP Range Calculator ---

export interface CidrInfo {
  networkAddress: string;
  broadcastAddress: string;
  usableHosts: number;
  totalHosts: number;
  ipRange: string;
  cidr: string;
  subnetMask: string;
  wildcardMask: string;
}

function calculateWildcardMask(subnetMask: string): string {
  return subnetMask.split('.').map(octet => 255 - parseInt(octet, 10)).join('.');
}

export function getCidrInfo(cidrString: string): CidrInfo | { error: string } {
  try {
    const address = new Address4(cidrString);

    const networkAddress = address.startAddress().address;
    const broadcastAddress = address.endAddress().address;
    const totalHosts = address.endAddress().bigInteger().subtract(address.startAddress().bigInteger()).add(1).toJSNumber();
    
    let usableHosts: number;
    let ipRange: string;

    if (address.subnetMask === 32) {
      usableHosts = 1;
      ipRange = networkAddress;
    } else if (address.subnetMask === 31) {
      usableHosts = 2;
      ipRange = `${networkAddress} - ${broadcastAddress}`;
    } else {
      usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;
      if (usableHosts > 0) {
        const firstUsable = address.startAddress().add(1).address;
        const lastUsable = address.endAddress().subtract(1).address;
        ipRange = `${firstUsable} - ${lastUsable}`;
      } else {
        ipRange = 'N/A';
      }
    }

    const subnetMask = address.subnet;
    const wildcardMask = calculateWildcardMask(subnetMask);

    return {
      networkAddress,
      broadcastAddress,
      usableHosts,
      totalHosts,
      ipRange,
      cidr: address.cidr,
      subnetMask,
      wildcardMask,
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

// --- Feature 2: IP Range to CIDR Converter ---

export function getCidrFromRange(startIp: string, endIp: string): { cidrs: string[] } | { error: string } {
  try {
    const start = new Address4(startIp);
    const end = new Address4(endIp);
    if (start.bigInteger().compareTo(end.bigInteger()) > 0) {
      return { error: 'Start IP address must be less than or equal to End IP address.' };
    }
    const summarized = Address4.summarize(start, end);
    return { cidrs: summarized.map(a => a.cidr) };
  } catch (error: any) {
    return { error: error.message };
  }
}

// --- Feature 3: Subnetting Tool ---

export interface SubnetInfo extends CidrInfo {
  subnetId: number;
}

export function calculateSubnetsBySubnetCount(networkCidr: string, numberOfSubnets: number): { subnets: SubnetInfo[] } | { error: string } {
    try {
        const address = new Address4(networkCidr);
        if (numberOfSubnets <= 0 || !Number.isInteger(numberOfSubnets)) {
            return { error: 'Number of subnets must be a positive integer.' };
        }

        const bitsNeeded = Math.ceil(Math.log2(numberOfSubnets));
        const newSubnetMask = address.subnetMask + bitsNeeded;

        if (newSubnetMask > 32) {
            return { error: 'Not enough address space to create the requested number of subnets.' };
        }

        const subnets = address.subnet(newSubnetMask);
        return {
            subnets: subnets.map((subnet, index) => {
                const info = getCidrInfo(subnet.cidr);
                if ('error' in info) {
                    throw new Error(info.error); // Should not happen
                }
                return { ...info, subnetId: index + 1 };
            })
        };
    } catch (error: any) {
        return { error: error.message };
    }
}

export function calculateSubnetsByHostCount(networkCidr: string, numberOfHosts: number): { subnets: SubnetInfo[], hostsPerSubnet: number, newSubnetMask: number } | { error: string } {
    try {
        const address = new Address4(networkCidr);
        if (numberOfHosts <= 0 || !Number.isInteger(numberOfHosts)) {
            return { error: 'Number of hosts must be a positive integer.' };
        }

        const hostsNeeded = numberOfHosts >= 2 ? numberOfHosts + 2 : (numberOfHosts === 1 ? 1 : 2);
        const bitsNeeded = Math.ceil(Math.log2(hostsNeeded));
        const newSubnetMask = 32 - bitsNeeded;

        if (newSubnetMask < address.subnetMask) {
            return { error: 'The requested number of hosts is too large for the given network.' };
        }
        
        const subnets = address.subnet(newSubnetMask);
        const totalHostsPerSubnet = Math.pow(2, 32 - newSubnetMask);
        const usableHostsPerSubnet = newSubnetMask >= 31 ? totalHostsPerSubnet : totalHostsPerSubnet - 2;

        return {
            subnets: subnets.map((subnet, index) => {
                const info = getCidrInfo(subnet.cidr);
                if ('error' in info) {
                    throw new Error(info.error);
                }
                return { ...info, subnetId: index + 1 };
            }),
            hostsPerSubnet: usableHostsPerSubnet,
            newSubnetMask
        };
    } catch (error: any) {
        return { error: error.message };
    }
}

// --- Feature 4: CIDR/Netmask/Wildcard Converter ---

export interface MaskInfo {
    cidr: number;
    subnetMask: string;
    wildcardMask: string;
}

function isValidMask(mask: string, type: 'subnet' | 'wildcard'): { valid: boolean, address?: Address4 } {
    try {
        const maskToTest = type === 'subnet' ? mask : mask.split('.').map(o => 255 - parseInt(o, 10)).join('.');
        const address = new Address4(`10.0.0.1/${maskToTest}`);
        return { valid: address.subnetMask >= 0 && address.subnetMask <= 32, address };
    } catch {
        return { valid: false };
    }
}

export function convertMask(input: string): MaskInfo | { error: string } {
    try {
        const trimmedInput = input.trim();
        if (trimmedInput.startsWith('/')) {
            const cidr = parseInt(trimmedInput.substring(1), 10);
            if (isNaN(cidr) || cidr < 0 || cidr > 32) throw new Error('Invalid CIDR notation.');
            const subnetMask = new Address4(`0.0.0.0/${cidr}`).subnet;
            return {
                cidr,
                subnetMask: subnetMask,
                wildcardMask: calculateWildcardMask(subnetMask),
            };
        }

        if (trimmedInput.includes('.')) {
            // Try as subnet mask
            const subnetCheck = isValidMask(trimmedInput, 'subnet');
            if (subnetCheck.valid && subnetCheck.address) {
                return {
                    cidr: subnetCheck.address.subnetMask,
                    subnetMask: trimmedInput,
                    wildcardMask: calculateWildcardMask(trimmedInput),
                };
            }
            // Try as wildcard mask
            const wildcardCheck = isValidMask(trimmedInput, 'wildcard');
            if (wildcardCheck.valid && wildcardCheck.address) {
                const subnetMask = trimmedInput.split('.').map(o => 255 - parseInt(o, 10)).join('.');
                return {
                    cidr: wildcardCheck.address.subnetMask,
                    subnetMask: subnetMask,
                    wildcardMask: trimmedInput,
                };
            }
        }
        
        throw new Error('Invalid input. Use CIDR (e.g., /24), subnet mask, or wildcard mask.');

    } catch (error: any) {
        return { error: error.message };
    }
}

// --- Feature 5: CIDR Overlap Checker ---

export interface OverlapResult {
    cidr1: string;
    cidr2: string;
    type: 'contains' | 'is_contained_by' | 'overlaps_with';
}

export function checkCidrOverlap(cidrList: string[]): { overlaps: OverlapResult[], duplicates: string[] } | { error: string } {
    try {
        const uniqueCidrs = [...new Set(cidrList.filter(c => c.trim() !== ''))];
        const duplicates = cidrList.filter((c, i) => c.trim() !== '' && cidrList.indexOf(c) !== i);
        
        const addresses = uniqueCidrs.map(c => new Address4(c));
        const overlaps: OverlapResult[] = [];

        for (let i = 0; i < addresses.length; i++) {
            for (let j = i + 1; j < addresses.length; j++) {
                const addr1 = addresses[i];
                const addr2 = addresses[j];

                const start1 = addr1.startAddress().bigInteger();
                const end1 = addr1.endAddress().bigInteger();
                const start2 = addr2.startAddress().bigInteger();
                const end2 = addr2.endAddress().bigInteger();

                // Check for full containment
                if (start1.compareTo(start2) <= 0 && end1.compareTo(end2) >= 0) {
                    overlaps.push({ cidr1: addr1.cidr, cidr2: addr2.cidr, type: 'contains' });
                    continue; 
                }
                if (start2.compareTo(start1) <= 0 && end2.compareTo(end1) >= 0) {
                    // To keep the order consistent for the user, report as cidr1 is_contained_by cidr2
                    overlaps.push({ cidr1: addr1.cidr, cidr2: addr2.cidr, type: 'is_contained_by' });
                    continue;
                }

                // Check for partial overlap
                if (start1.compareTo(end2) <= 0 && end1.compareTo(start2) >= 0) {
                    overlaps.push({ cidr1: addr1.cidr, cidr2: addr2.cidr, type: 'overlaps_with' });
                }
            }
        }
        return { overlaps, duplicates: [...new Set(duplicates)] };
    } catch (error: any) {
        return { error: error.message };
    }
}
